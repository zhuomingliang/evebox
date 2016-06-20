import {Pipe, PipeTransform} from "@angular/core";

/**
 * Example usage:
 *
 *     <div *ngFor="let item of event._source.http | mapToItems">
 *         {{item.key}} = {{item.val}}
 *     </div>
 */
@Pipe({
    name: "mapToItems"
})
export class MapToItemsPipe implements PipeTransform {

    transform(value:any, args:any):any {
        return Object.keys(value).map(key => {
            return {
                key: key,
                val: value[key]
            };
        });
    }

}