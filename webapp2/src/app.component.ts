import {Component} from "@angular/core";
import {Routes, ROUTER_DIRECTIVES, Router} from "@angular/router";

import {ConfigService} from "./config.service";
import {TopNavComponent} from "./topnav.component";
import {ElasticSearchService} from "./elasticsearch.service";
import {InboxComponent} from "./inbox.component";

@Component({
    selector: "evebox-app",
    template: `<evebox-top-nav></evebox-top-nav>
<div class="container-fluid">
<route-view></route-view>
</div>
`,
    directives: [TopNavComponent, ROUTER_DIRECTIVES]
})
export class AppComponent {

    constructor(private configService:ConfigService,
                private elasticSearchService:ElasticSearchService) {
    }

}
