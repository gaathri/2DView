import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/modules/core/services/interaction.service';

@Component({
  selector: 'app-favourites-home',
  templateUrl: './favourites-home.component.html',
  styleUrls: ['./favourites-home.component.scss']
})
export class FavouritesHomeComponent implements OnInit {

  constructor(
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
  }

}
