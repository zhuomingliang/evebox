import {Component} from "@angular/core";
import {ElasticSearchService} from "./elasticsearch.service";

@Component({
    selector: "evebox-top-nav",
    template: `<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed"
              data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#/">EveBox</a>
    </div>

    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li linkActive="active"><a linkTo="/inbox">Inbox</a></li>
        <li linkActive="active"><a linkTo="/escalated">Escalated</a></li>
        <li linkActive="active"><a linkTo="/alerts">Alerts</a></li>
        <li linkActive="active"><a linkTo="/events">Events</a></li>
      </ul>

      <ul class="nav navbar-nav navbar-right">
        <li>
          <a><span class="badge">{{elasticSearchService.jobSize()}}</span></a>
        </li>
      </ul>
    </div>

  </div>
</nav>`
})
export class TopNavComponent {

    constructor(private elasticSearchService:ElasticSearchService) {
    }

}