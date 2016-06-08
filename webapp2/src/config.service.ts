import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class ConfigService {

    private config:any;

    constructor(private http:Http) {
        http.get("/api/config").toPromise()
            .then(response => {
                console.log(response);
            })
    }

    getEventServices() {
        if (this.config) {
            if (this.config["event-services"]) {
                return this.config["event-services"];
            }
        }
    }

}