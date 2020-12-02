import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportHomeComponent } from './report-home/report-home.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [ReportHomeComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ]
})
export class ReportModule { }
