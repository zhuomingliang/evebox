import {Component, Input, OnInit, OnDestroy, NgZone} from "@angular/core";
import moment = require("moment");

@Component({
    selector: "evebox-duration",
    template: "{{duration}} ago"
})
export class EveboxDurationComponent implements OnInit, OnDestroy {

    @Input("timestamp") private timestamp:any;
    private duration:any;
    private interval:any = null;

    constructor(private ngZone:NgZone) {
    }

    refresh() {
        let then = moment(this.timestamp);
        let now = moment();
        let diff = then.diff(now); //now.diff(then);
        let duration = moment.duration(diff); //umanize(true);
        //noinspection TypeScriptUnresolvedFunction
        this.duration = duration.humanize();
    }

    ngOnInit() {
        this.refresh();

        this.interval = window.setInterval(() => {
            this.ngZone.run(() => {
                this.refresh();
            });
        }, 60000);
    }

    ngOnDestroy():any {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }

}