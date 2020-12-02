import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeSheetRoutingModule } from './time-sheet-routing.module';
import { TaskTimeSheetComponent } from './task-time-sheet/task-time-sheet.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [TaskTimeSheetComponent],
  imports: [
    CommonModule,
    TimeSheetRoutingModule,
    SharedModule
  ]
})
export class TimeSheetModule { }
