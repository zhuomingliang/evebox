import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "eveboxFormatIpAddress"
})
export class EveboxFormatIpAddressPipe implements PipeTransform {

    transform(addr:string) {
        if (addr === undefined) {
            return "";
        }
        addr = addr.replace(/0000/g, "");
        while (addr.indexOf(":0:") > -1) {
            addr = addr.replace(/:0:/g, "::");
        }
        addr = addr.replace(/:::+/g, "::");
        while (addr != (addr = addr.replace(/:0+/g, ":")))
            ;
        return addr;
    }

}