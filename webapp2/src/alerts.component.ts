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

import {ElasticSearchService} from "./elasticsearch.service";

import moment = require("moment");
import {EveboxFormatTimestampPipe} from "./format-timestamp.pipe";
import {EveboxFormatIpAddressPipe} from "./format-ipaddress.pipe";
import {EveboxDurationComponent} from "./duration.component";
import {MousetrapService} from "./mousetrap.service";
import {KeyTableDirective} from "./keytable.directive";

@Component({
    template: `<div class="table-responsive">
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
    <tr *ngFor="let row of rows; let i = index" [ngClass]="row.class">
      <td><span *ngIf="i == keyTableState.activeRow"
                class="glyphicon glyphicon-chevron-right"></span></td>
      <td>
        <input type="checkbox" [(ngModel)]="row.selected">
      </td>
      <td>
        <i class="fa fa-star-o"></i>
      </td>
      <td>{{row.event.count}}</td>
      <td class="text-nowrap">
        {{row.date | eveboxFormatTimestamp}}
        <br/>
        <evebox-duration style="color: gray"
                         [timestamp]="row.event.newest._source.timestamp"></evebox-duration>
      </td>
      <td class="text-nowrap">
        <label>S:</label>
        {{row.event.newest._source.src_ip | eveboxFormatIpAddress}}
        <br/>
        <label>D:</label>
        {{row.event.newest._source.dest_ip | eveboxFormatIpAddress}}
      </td>
      <td>
        {{row.event.newest._source.alert.signature}}
      </td>
    </tr>
    </tbody>
  </table>
</div>`,
    directives: [NgClass,
        EveboxDurationComponent,
        KeyTableDirective],
    pipes: [EveboxFormatTimestampPipe,
        EveboxFormatIpAddressPipe]
})
export class AlertsComponent implements OnInit, OnDestroy {

    private events:any = [];
    private rows:any = [];

    private keyTableState:any = {
        activeRow: 0
    };

    constructor(private elasticSearchService:ElasticSearchService,
                private mousetrap:MousetrapService,
                private ngZone:NgZone) {
    }

    ngOnInit() {

        this.mousetrap.bind(this, "* a", () => {
            this.selectAllRows();
        });
        this.mousetrap.bind(this, "* n", () => {
            this.deselectAllRows();
        });
        this.mousetrap.bind(this, "x", () => {
            this.toggleSelectedState(this.getActiveRow());
        });

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

    refresh() {
        this.elasticSearchService.getAlerts()
            .then(response => {
                this.events = response;

                this.rows = response.map(event => {

                    let row:any = {
                        event: event,
                        selected: false
                    };

                    row.date = moment(event.newest._source.timestamp).toDate();

                    switch (event.newest._source.alert.severity) {
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

            });
    }

}