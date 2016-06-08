import {Component} from "@angular/core";

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
        <li class="active"><a>Inbox</a></li>
        <li><a>Escalated</a></li>
        <li><a>Alerts</a></li>
        <li><a>Events</a></li>
      </ul>
    </div>

  </div>
</nav>`
})
export class TopNavComponent {

}