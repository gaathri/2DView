import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { ArtistTaskListComponent } from './artist-task-list/artist-task-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ArtistTaskDetailComponent } from './artist-task-detail/artist-task-detail.component';


@NgModule({
  declarations: [ArtistTaskListComponent, ArtistTaskDetailComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule
  ]
})
export class TasksModule { }
