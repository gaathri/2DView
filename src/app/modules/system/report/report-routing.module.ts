import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportHomeComponent } from './report-home/report-home.component';


const routes: Routes = [
  { path: "", component: ReportHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
