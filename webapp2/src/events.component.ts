import {Component} from "@angular/core";

@Component({
    template: `<div class="row">
  <div class="col-md-12">
    <form (submit)="refresh()">
      <div class="form-group">
        <div class="input-group">
          <input type="text" class="form-control"/>
        <span class="input-group-btn">
          <button type="submit" class="btn btn-default">Search</button>
        </span>
        </div>
      </div>
    </form>
  </div>
</div>`
})
export class EventsComponent {

    refresh() {

    }
    
}