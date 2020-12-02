import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/modules/core/services/interaction.service';

@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.scss']
})
export class ReportHomeComponent implements OnInit {


  constructor(
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
  }

}
