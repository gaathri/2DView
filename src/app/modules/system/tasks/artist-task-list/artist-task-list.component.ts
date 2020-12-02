import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/modules/core/services/interaction.service';

@Component({
  selector: 'app-artist-task-list',
  templateUrl: './artist-task-list.component.html',
  styleUrls: ['./artist-task-list.component.scss']
})
export class ArtistTaskListComponent implements OnInit {


  constructor(
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
  }

}
