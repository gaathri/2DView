import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-list-form',
  templateUrl: './user-list-form.component.html',
  styleUrls: ['./user-list-form.component.scss']
})
export class UserListFormComponent implements OnInit {

  @Input() data: any;
  isDataReady: boolean;
  constructor() { }

  ngOnInit() {
    this.prepareData();

  }
  prepareData() {
    try {
      //this.data = this.row['Available Artists'].split(',');
      this.isDataReady = true;
    } catch (e) {
    }
  }

}
