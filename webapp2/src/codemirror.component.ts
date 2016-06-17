import {Component, OnInit, Input, OnChanges, NgZone} from "@angular/core";

var codemirror = require("codemirror");

require("codemirror/lib/codemirror.css");
require("codemirror/mode/javascript/javascript.js");

// Folding support. Doesn't work too well.
// require("codemirror/addon/fold/foldcode.js");
// require("codemirror/addon/fold/brace-fold.js");
// require("codemirror/addon/fold/foldgutter.js");
// require("codemirror/addon/fold/foldgutter.css");

@Component({
    selector: "codemirror",
    template: `<div id="codemirror-editor"></div>`
})
export class CodemirrorComponent implements OnInit {

    @Input("mode") textMode:string;
    @Input("text") text:string = "";

    private editor:any;

    ngOnInit() {
        this.refresh();
    }

    refresh() {

        let mode:any = false;

        switch (this.textMode) {
            case "json":
                mode = "application/json";
                break;
        }

        this.editor = codemirror(document.getElementById("codemirror-editor"), {
            lineNumbers: true,
            lineWrapping: true,
            value: this.text,
            mode: mode,
            readOnly: true
        });
        this.editor.setSize("100%", "100%");

    }
}