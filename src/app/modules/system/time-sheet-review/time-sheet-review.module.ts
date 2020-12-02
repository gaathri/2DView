import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeSheetReviewRoutingModule } from './time-sheet-review-routing.module';
import { TaskTimeSheetReviewComponent } from './task-time-sheet-review/task-time-sheet-review.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [TaskTimeSheetReviewComponent],
  imports: [
    CommonModule,
    TimeSheetReviewRoutingModule,
    SharedModule
  ]
})
export class TimeSheetReviewModule { }
