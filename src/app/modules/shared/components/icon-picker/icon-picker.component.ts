import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-icon-picker",
  templateUrl: "./icon-picker.component.html",
  styleUrls: ["./icon-picker.component.scss"],
})
export class IconPickerComponent implements OnInit {
  @Input() iconType: any;
  @Input() iconClass: any;

  constructor() {}

  ngOnInit() {}

  getClass() {
    let myclass = {};
    if (this.iconClass) {
      myclass[this.iconClass] = true;
    }
    return myclass;
  }
}
