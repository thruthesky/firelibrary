import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        TranslatePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TranslatePipe
    ]
})
export class TranslatePipeModule { }

