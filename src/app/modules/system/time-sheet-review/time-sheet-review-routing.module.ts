import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskTimeSheetReviewComponent } from './task-time-sheet-review/task-time-sheet-review.component';


const routes: Routes = [
  { path: "", component: TaskTimeSheetReviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeSheetReviewRoutingModule { }
