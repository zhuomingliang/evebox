import {Component, OnInit} from "@angular/core";
import {RouteParams} from "@ngrx/router";
import {ElasticSearchService} from "./elasticsearch.service";
import {EventSeverityToBootstrapClass} from "./event-severity-to-bootstrap-class.filter";
import {CodemirrorComponent} from "./codemirror.component";
import {JsonPipe} from "@angular/common";

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
    pipes: [EventSeverityToBootstrapClass, JsonPipe],
    directives: [CodemirrorComponent]
})
export class EventComponent implements OnInit {

    private eventId:string;
    event:any = {};

    constructor(private routeParams:RouteParams,
                private elasticSearchService:ElasticSearchService) {
        routeParams.pluck<string>("id")
            .subscribe(x => console.log(x));
    }

    ngOnInit() {
        this.routeParams.pluck<string>("id").subscribe(id => {
            this.eventId = id;
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