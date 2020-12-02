import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";

@Component({
  selector: "app-studio-db-settings",
  templateUrl: "./studio-db-settings.component.html",
  styleUrls: ["./studio-db-settings.component.scss"],
})
export class StudioDbSettingsComponent implements OnInit {
  @Input() statuses: any;
  @Input() allWorkStatuses: any;
  @Input() overallSelectedItems: any;
  @Input() overallAssetSelectedItems: any;
  @Input() overallTaskSelectedItems: any;
  @Input() starSelectedItems: any;
  @Input() starUserSelectedItems: any;

  starUserStatusMax = 2;
  starStatusMax = 4;
  overallStatusMax = 5;

  constructor(private drawerRef: NzDrawerRef<string>) {}

  ngOnInit() {}

  changeHandler(e: any, type: any) {
    if (type === "overall") {
      this.overallSelectedItems = e;
    } else if (type === "asset") {
      this.overallAssetSelectedItems = e;
    } else if (type === "task") {
      this.overallTaskSelectedItems = e;
    } else if (type === "star") {
      this.starSelectedItems = e;
    } else if (type === "star_user") {
      this.starUserSelectedItems = e;
    }
  }

  isChecked(status: any, type: any) {
    let itemsToCheck = this.overallSelectedItems;
    if (type === "asset") {
      itemsToCheck = this.overallAssetSelectedItems;
    } else if (type === "task") {
      itemsToCheck = this.overallTaskSelectedItems;
    } else if (type === "star") {
      itemsToCheck = this.starSelectedItems;
    } else if (type === "star_user") {
      itemsToCheck = this.starUserSelectedItems;
    }
    let obj = null;
    if (type === "task") {
      obj = itemsToCheck.find((data) => data.name === status.name);
    } else {
      obj = itemsToCheck.find((data) => data.name === status.name);
    }
    if (obj) {
      return true;
    } else {
      return false;
    }
  }

  isDisabled(status: any, type: any) {
    let disabled = false;
    let itemsToCheck = this.overallSelectedItems;
    let max = this.overallStatusMax;

    if (type === "asset") {
      itemsToCheck = this.overallAssetSelectedItems;
      max = this.overallStatusMax;
    } else if (type === "task") {
      itemsToCheck = this.overallTaskSelectedItems;
      max = this.overallStatusMax;
    } else if (type === "star") {
      itemsToCheck = this.starSelectedItems;
      max = this.starStatusMax;
    } else if (type === "star_user") {
      itemsToCheck = this.starUserSelectedItems;
      max = this.starUserStatusMax;
    }
    if (itemsToCheck && itemsToCheck.length >= max) {
      let obj = null;
      if (type === "task") {
        obj = itemsToCheck.find((item) => item.name === status.name);
      } else {
        obj = itemsToCheck.find((item) => item.id === status.id);
      }
      if (!obj) {
        disabled = true;
      }
    }
    return disabled;
  }

  submitHandler() {
    let result = {
      overallSelectedItems: this.overallSelectedItems,
      overallAssetSelectedItems: this.overallAssetSelectedItems,
      overallTaskSelectedItems: this.overallTaskSelectedItems,
      starSelectedItems: this.starSelectedItems,
      starUserSelectedItems: this.starUserSelectedItems,
    };
    this.drawerRef.close(JSON.stringify(result));
  }
}
