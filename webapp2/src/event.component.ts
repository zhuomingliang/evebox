/* Copyright (c) 2014-2016 Jason Ish
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

import {Component, OnInit} from "@angular/core";
import {ElasticSearchService} from "./elasticsearch.service";
import {EventSeverityToBootstrapClass} from "./event-severity-to-bootstrap-class.filter";
import {CodemirrorComponent} from "./codemirror.component";
import {JsonPipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MapToItemsPipe} from "./maptoitems.pipe";
import {EveBoxGenericPrettyPrinter} from "./generic-pretty-printer.pipe";

@Component({
    template: `<div *ngIf="event._source">
  <div class="panel {{event | eventSeverityToBootstrapClass:'panel-'}}">
    <div class="panel-heading">
      {{event._source.alert.signature}}
    </div>
    <div class="panel-body">

      <div class="row">
        <div class="col-md-5">
          <dl class="dl-horizontal">
            <dt>Timestamp</dt>
            <dd>{{event._source.timestamp}}</dd>
            <dt>Protocol</dt>
            <dd>{{event._source.proto}}</dd>
            <dt>Source</dt>
            <dd>
              {{event._source.src_ip}}<span
                *ngIf="event._source.src_port"
                style="color: dimgray">:{{event._source.src_port}}
            </span>
            </dd>
            <dt>Destination</dt>
            <dd>
              {{event._source.dest_ip}}<span
                *ngIf="event._source.dest_port"
                style="color: dimgray">:{{event._source.dest_port}}
            </span>
            </dd>

            <div ng-if="event._source.in_iface">
              <dt>In Interface</dt>
              <dd>{{event._source.in_iface}}</dd>
            </div>
            <div ng-if="event._source.flow_id">
              <dt>Flow ID</dt>
              <dd>{{event._source.flow_id}}</dd>
            </div>

          </dl>
        </div>

        <div class="col-md-7">

          <div [ngSwitch]="event._source.event_type">

            <div *ngSwitchCase="'alert'">
              <dl class="dl-horizontal">
                <dt>Signature</dt>
                <dd>{{event._source.alert.signature}}
                </dd>
                <dt>Category</dt>
                <dd>{{event._source.alert.category}}
                </dd>
                <dt>Signature ID</dt>
                <dd>
                  {{event._source.alert.gid}}:{{event._source.alert.signature_id}}:{{event._source.alert.rev}}
                </dd>
                <dt>Severity</dt>
                <dd>{{event._source.alert.severity}}
                </dd>
              </dl>
            </div>

            <div *ngSwitchDefault>default</div>

          </div>

        </div>

      </div>

    </div>
    
    
  </div>

  <!-- HTTP. -->
  <div *ngIf="event._source.http" class="panel panel-default">
    <div class="panel-heading">
      HTTP
    </div>
    <div class="panel-body">
    <dl class="dl-horizontal">
      <div *ngFor="let item of event._source.http | mapToItems">
        <dt>{{item.key | genericPrettyPrinter}}</dt>
        <dd>{{item.val}}</dd>
      </div>
      </dl>
    </div>
  </div>
  
  <!-- JSON -->
  <div class="panel panel-default">
    <div class="panel-heading">
      JSON
    </div>
    <div class="panel-body" style="padding: 0px;">
    <codemirror mode="json" text="{{event | json}}"></codemirror>
    </div>
  </div>

</div>
`,
    pipes: [
        EventSeverityToBootstrapClass, JsonPipe, MapToItemsPipe,
        EveBoxGenericPrettyPrinter
    ],
    directives: [CodemirrorComponent]
})
export class EventComponent implements OnInit {

    private eventId:string;
    event:any = {};

    constructor(private route:ActivatedRoute,
                private router:Router,
                private elasticSearchService:ElasticSearchService) {
    }

    ngOnInit() {
        this.route.params.subscribe((params:any) => {
            this.eventId = params.id;
            this.refresh();
        });
    }

    refresh() {

        this.elasticSearchService.getEventById(this.eventId)
            .then(
                (response) => {
                    console.log(response);
                    this.event = response;
                },
                (error) => {
                    console.log("Got an error.");
                });
    }
}