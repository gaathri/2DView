import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/modules/core/services/interaction.service';

@Component({
  selector: 'app-task-time-sheet-review',
  templateUrl: './task-time-sheet-review.component.html',
  styleUrls: ['./task-time-sheet-review.component.scss']
})
export class TaskTimeSheetReviewComponent implements OnInit {

  constructor(
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
  }

}
