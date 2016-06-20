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

import {Component} from "@angular/core";
import {ElasticSearchService} from "./elasticsearch.service";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";

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
        <li [ngClass]="{active: isActive('/inbox')}"><a [routerLink]="['/inbox']">Inbox</a></li>
        <li linkActive="active"><a>Escalated</a></li>
        <li linkActive="active"><a>Alerts</a></li>
        <li linkActive="active"><a>Events</a></li>
      </ul>

      <ul class="nav navbar-nav navbar-right">
        <li>
          <a><span class="badge">{{elasticSearchService.jobSize()}}</span></a>
        </li>
      </ul>
    </div>

  </div>
</nav>`,
    directives: [ROUTER_DIRECTIVES]
})
export class TopNavComponent {

    constructor(private elasticSearchService:ElasticSearchService,
                private router:Router, private _route:ActivatedRoute) {
    }

    isActive(route:any) {
        return route == this.router.url;
    }

}