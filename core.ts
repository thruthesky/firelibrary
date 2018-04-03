import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import * as firebase from 'firebase';
import { FireService } from './providers/fire.service';
export * from './providers/fire.service';
import { Base, SYSTEM_CONFIG, SystemConfig } from './providers/etc/base';
export * from './providers/etc/base';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [{ provide: FireService, useClass: FireService }]
})
export class FirelibraryModule {
  public static forRoot(config: SYSTEM_CONFIG): ModuleWithProviders {
    return {
      ngModule: FirelibraryModule,
      providers: [
        FireService,
        { provide: SystemConfig, useValue: config }
      ],
    };
  }
}
