// Polyfills.
import "core-js/es6";
import "reflect-metadata";
require("zone.js/dist/zone");

// Vendor.

// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';

// RxJS
import 'rxjs';
// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...
import "bootstrap/dist/css/bootstrap.css";

import {bootstrap} from "@angular/platform-browser-dynamic";
import {enableProdMode} from '@angular/core';
import {HTTP_PROVIDERS} from "@angular/http";
import {ROUTER_PROVIDERS} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {provide} from "@angular/core";

import "bootstrap";

import "./evebox.scss";

import {AppComponent} from "./app.component";

// Globally available services.
import {ConfigService} from "./config.service";
import {ElasticSearchService} from "./elasticsearch.service";
import {MousetrapService} from "./mousetrap.service";

//noinspection TypeScriptValidateTypes
bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {
        useClass: HashLocationStrategy
    }),
    ConfigService,
    ElasticSearchService,
    MousetrapService
]);
