import { Pipe, PipeTransform } from '@angular/core';
import { FireService } from '../../core';
@Pipe({
    name: 't',
    pure: true
})
export class TranslatePipe implements PipeTransform {
    constructor( public fire: FireService ) {}
    transform(value, args) {
        return this.fire.t(value, args);
    }
}

