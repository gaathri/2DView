import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist-task-detail',
  templateUrl: './artist-task-detail.component.html',
  styleUrls: ['./artist-task-detail.component.scss']
})
export class ArtistTaskDetailComponent implements OnInit {

  taskId: any;
  constructor(
    private activatedRouter: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.taskId = params["taskId"];
    });
  }

}
