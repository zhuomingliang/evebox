import {Pipe, PipeTransform} from "@angular/core";

import moment = require("moment");

@Pipe({
    name: "eveboxFormatTimestamp"
})
export class EveboxFormatTimestampPipe implements PipeTransform {

    transform(timestamp:string) {
        return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    }

}