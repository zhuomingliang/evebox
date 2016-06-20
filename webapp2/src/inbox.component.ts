/* Copyright (c) 2014-2015 Jason Ish
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import {Component, OnInit, OnDestroy, NgZone} from "@angular/core";
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

import moment = require("moment");

import {ElasticSearchService, AlertGroup} from "./elasticsearch.service";
import {EveboxFormatTimestampPipe} from "./format-timestamp.pipe";
import {EveboxFormatIpAddressPipe} from "./format-ipaddress.pipe";
import {EveboxDurationComponent} from "./duration.component";
import {MousetrapService} from "./mousetrap.service";
import {KeyTableDirective} from "./keytable.directive";

@Component({
    template: `<!-- Div will "fade" the page while loading events. -->
<div [ngClass]="{'evebox-opacity-50': loading}">

  <div class="row">
    <div class="col-md-6">
      <button type="button" class="btn btn-default" (click)="refresh()">Refresh
      </button>
      <button *ngIf="rows.length > 0 && !allSelected()" type="button"
              class="btn btn-default"
              (click)="selectAllRows()">Select All
      </button>
      <button *ngIf="rows.length > 0 && allSelected()" type="button"
              class="btn btn-default"
              (click)="deselectAllRows()">Deselect All
      </button>
      <button *ngIf="rows.length > 0 && getSelectedCount() > 0" type="button"
              class="btn btn-default"
              (click)="archiveSelected()">Archive
      </button>
    </div>
    <div class="col-md-6">

      <br class="hidden-lg hidden-md"/>

      <form (submit)="refresh()">
        <div class="input-group">
          <input id="filter-input" type="text" class="form-control"
                 placeholder="Filter..." [(ngModel)]="queryString"/>
          <div class="input-group-btn">
            <button class="btn btn-default" type="submit">Apply</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Font awesome spinner that will be display midway down the page while alerts
       are loading. -->
  <div *ngIf="loading" class="row">
    <div class="col-md-12">
      <i class="fa fa-spinner fa-pulse"
         style="font-size: 300px; position: absolute; left: 50%; margin-left: -150px; opacity: 0.8;"></i>
    </div>
  </div>

  <div *ngIf="rows.length == 0" style="text-align: center;">
    <hr/>
    No new events.
    <hr/>
  </div>

  <br/>

  <div *ngIf="rows.length > 0" class="table-responsive">
    <table class="table table-condensed table-hover evebox-event-table"
           eveboxKeyTable
           [rows]="rows"
           [(keyTableState)]="keyTableState">
      <thead>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th>#</th>
        <th>Timestamp</th>
        <th>Source/Dest</th>
        <th width="50%;">Signature</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of rows; let i = index" [ngClass]="row.class" (click)="openEvent(row.event)"> <td><span *ngIf="i == keyTableState.activeRow"
                  class="glyphicon glyphicon-chevron-right"></span></td>
        <td>
          <input type="checkbox" [(ngModel)]="row.selected">
        </td>
        <td>
          <i *ngIf="row.event.escalatedCount == 0"
             class="fa fa-star-o"
             (click)="toggleEscalatedState(row)"></i>
          <i *ngIf="row.event.escalatedCount == row.event.count"
             class="fa fa-star"
             (click)="toggleEscalatedState(row)"></i>
          <i *ngIf="row.event.escalatedCount > 0 &&  row.event.escalatedCount != row.event.count"
             class="fa fa-star-half-o"
             (click)="toggleEscalatedState(row)"></i>
        </td>
        <td>{{row.event.count}}</td>
        <td class="text-nowrap">
          {{row.date | eveboxFormatTimestamp}}
          <br/>
          <evebox-duration style="color: gray"
                           [timestamp]="row.event.newestTs"></evebox-duration>
        </td>
        <td class="text-nowrap">
          <label>S:</label>
          {{row.event.event._source.src_ip | eveboxFormatIpAddress}}
          <br/>
          <label>D:</label>
          {{row.event.event._source.dest_ip | eveboxFormatIpAddress}}
        </td>
        <td>
          <button type="button" class="btn btn-default pull-right"
                  (click)="archiveAlertGroup(row)">Archive
          </button>
          {{row.event.event._source.alert.signature}}
        </td>
      </tr>
      </tbody>
    </table>
  </div>

</div>`,
    directives: [NgClass,
        EveboxDurationComponent,
        KeyTableDirective],
    pipes: [EveboxFormatTimestampPipe,
        EveboxFormatIpAddressPipe]
})
export class InboxComponent implements OnInit, OnDestroy {

    private events:any = [];
    private rows:any = [];
    private queryString:string;

    private keyTableState:any = {
        activeRow: 0
    };

    /* Flag that will be setting when events are loading/refreshing. */
    private loading:boolean = false;

    constructor(private elasticSearchService:ElasticSearchService,
                private mousetrap:MousetrapService,
                private router:Router) {
    }

    ngOnInit() {

        this.mousetrap.bind(this, "* a", () => this.selectAllRows());
        this.mousetrap.bind(this, "* n", () => this.deselectAllRows());
        this.mousetrap.bind(this, "x", () =>
            this.toggleSelectedState(this.getActiveRow()));
        this.mousetrap.bind(this, "r", () => this.refresh());
        this.mousetrap.bind(this, "e", () => this.archiveEvents());
        this.mousetrap.bind(this, "f8", () => this.archiveActiveEvent());
        this.mousetrap.bind(this, "s", () =>
            this.toggleEscalatedState(this.getActiveRow()));
        this.mousetrap.bind(this, "/", () => this.focusFilterInput());
        this.mousetrap.bind(this, "o", () => this.openActiveEvent());

        this.refresh();
    }

    ngOnDestroy():any {
        this.mousetrap.unbind(this);
    }

    getActiveRowIndex() {
        return this.keyTableState.activeRow;
    }

    getActiveRow() {
        return this.rows[this.getActiveRowIndex()];
    }

    openActiveEvent() {
        console.log("openActiveEvent");
        this.openEvent(this.getActiveRow().event);
    }

    openEvent(event:AlertGroup) {
        this.router.navigate(['/event', event.event._id]);
    }

    focusFilterInput() {
        document.getElementById("filter-input").focus();
    }

    /**
     * Return true if all rows are selected.
     */
    allSelected() {
        return this.rows.every((row:any) => {
            return row.selected;
        })
    }

    selectAllRows() {
        this.rows.forEach((row:any) => {
            row.selected = true;
        });
    }

    toggleSelectedState(row:any) {
        row.selected = !row.selected;
    }

    deselectAllRows() {
        this.rows.forEach((row:any) => {
            row.selected = false;
        });
    }

    removeRow(row:any) {
        this.rows = this.rows.filter((_row:any) => {
            if (_row == row) {
                return false;
            }
            return true;
        });
    }

    getSelectedRows() {
        return this.rows.filter((row:any) => {
            return row.selected;
        });
    }

    getSelectedCount() {
        return this.getSelectedRows().length;
    }

    archiveSelected() {
        let selected = this.rows.filter((row:any) => {
            return row.selected;
        });
        selected.forEach((row:any) => {
            this.archiveAlertGroup(row);
        });
    }

    archiveActiveEvent() {
        this.archiveAlertGroup(this.getActiveRow());
    }

    archiveEvents() {
        // If rows are selected, archive the selected rows, otherwise archive
        // the current active event.
        if (this.getSelectedCount() > 0) {
            this.archiveSelected();
        }
        else {
            this.archiveActiveEvent();
        }
    }

    archiveAlertGroup(row:any) {
        // Optimistically remove the row from view.
        this.removeRow(row);

        this.elasticSearchService.archiveAlertGroup(row.event);
    }

    toggleEscalatedState(row:any) {
        let alertGroup:AlertGroup = row.event;

        if (alertGroup.escalatedCount < alertGroup.count) {

            // Optimistically mark as all escalated.
            alertGroup.escalatedCount = alertGroup.count;

            this.elasticSearchService.escalateAlertGroup(alertGroup);
        }

        else if (alertGroup.escalatedCount == alertGroup.count) {

            // Optimistically mark all as de-escalated.
            alertGroup.escalatedCount = 0;

            this.elasticSearchService.removeEscalatedStateFromAlertGroup(alertGroup);
        }
    }

    refresh() {

        this.loading = true;

        // May be triggered from the filter input, blur the focus.
        document.getElementById("filter-input").blur();

        this.elasticSearchService.getAlerts({
            queryString: this.queryString
        }).then(response => {
            this.events = response;

            this.rows = response.map((event:AlertGroup) => {

                let row:any = {
                    event: event,
                    selected: false
                };

                row.date = moment(event.newestTs).toDate();

                switch (event.event._source.alert.severity) {
                    case 1:
                        row.class = "danger";
                        break;
                    case 2:
                        row.class = "warning";
                        break;
                    case 3:
                        row.class = "info";
                        break;
                    default:
                        row.class = "";
                        break;
                }

                return row;
            });

            this.loading = false;

        });
    }

}
