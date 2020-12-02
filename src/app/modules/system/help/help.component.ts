import { Component, OnInit } from "@angular/core";
import { InteractionService } from '../../core/services/interaction.service';

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"]
})
export class HelpComponent implements OnInit {
  constructor(
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
  }
}
