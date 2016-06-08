import {Component} from "@angular/core";
import {Routes, ROUTER_DIRECTIVES, Router} from "@angular/router";

import {ConfigService} from "./config.service";
import {TopNavComponent} from "./topnav.component";
import {ElasticSearchService} from "./elasticsearch.service";
import {AlertsComponent} from "./alerts.component";

@Component({
    selector: "evebox-app",
    template: `<evebox-top-nav></evebox-top-nav>
<div class="container-fluid">
<router-outlet></router-outlet>
</div>
`,
    directives: [TopNavComponent, ROUTER_DIRECTIVES]
})
@Routes([
    {path: "/alerts", component: AlertsComponent},
    {path: "", component: AlertsComponent},
])
export class AppComponent {

    constructor(public router:Router,
                private configService:ConfigService,
                private elasticSearchService:ElasticSearchService) {
    }

}
