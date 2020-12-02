import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-asset-detail-tab",
  templateUrl: "./asset-detail-tab.component.html",
  styleUrls: ["./asset-detail-tab.component.scss"],
})
export class AssetDetailTabComponent implements OnInit {
  @Input() assetIn: any;

  constructor() {}

  ngOnInit() {}

  getProgress(assetIn) {
    if (assetIn && assetIn.completionPercentage) {
      return Number(assetIn.completionPercentage) + " %";
    }
    return "0 %";
  }
}
