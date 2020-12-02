import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DaybookRoutingModule } from './daybook-routing.module';
import { DaybookHomeComponent } from './daybook-home/daybook-home.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [DaybookHomeComponent],
  imports: [
    CommonModule,
    DaybookRoutingModule,
    SharedModule
  ]
})
export class DaybookModule { }
