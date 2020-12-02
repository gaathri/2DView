import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/modules/core/services/interaction.service';

@Component({
  selector: 'app-daybook-home',
  templateUrl: './daybook-home.component.html',
  styleUrls: ['./daybook-home.component.scss']
})
export class DaybookHomeComponent implements OnInit {

  constructor(private interactionService: InteractionService) { }

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
  }

}
