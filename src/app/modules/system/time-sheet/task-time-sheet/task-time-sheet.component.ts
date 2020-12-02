import { Component, OnInit } from "@angular/core";
import { InteractionService } from "src/app/modules/core/services/interaction.service";

@Component({
  selector: "app-task-time-sheet",
  templateUrl: "./task-time-sheet.component.html",
  styleUrls: ["./task-time-sheet.component.scss"]
})
export class TaskTimeSheetComponent implements OnInit {
  constructor(
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
  }
}
