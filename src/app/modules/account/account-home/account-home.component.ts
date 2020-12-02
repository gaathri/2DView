import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-home',
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.scss']
})
export class AccountHomeComponent implements OnInit {

  loginPanelheight: any;
  windowHeight: any;
  constructor() { }

  ngOnInit() {
    this.loginPanelHeight();
  }

  onResize() {
    this.loginPanelHeight();
  }

  loginPanelHeight() {
    this.windowHeight = window.innerHeight;
    let originalPanelHeight = this.windowHeight - 1;
    this.loginPanelheight = originalPanelHeight;
  }

}
