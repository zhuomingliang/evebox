import {Injectable, NgZone} from "@angular/core";

var mousetrap = require("mousetrap/mousetrap");

@Injectable()
export class MousetrapService {

    private bindings:any[] = [];

    constructor(private ngZone:NgZone) {
    }

    bind(component:any, key:string, handler:any) {
        mousetrap.bind(key, (e:any) => {
            this.ngZone.run(() => {
                e.preventDefault();
                handler();
            });
        });
        this.bindings.push({
            component: component,
            key: key
        });
    }

    unbind(component:any) {
        this.bindings.forEach(binding => {
            if (binding.component == component) {
                console.log("Unbinding " + binding.key);
                mousetrap.unbind(binding.key);
            }
        });
        this.bindings = this.bindings.filter(binding => {
            return binding.component != component;
        })
    }
}