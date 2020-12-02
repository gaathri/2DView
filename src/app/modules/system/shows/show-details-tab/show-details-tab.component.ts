import { Component, OnInit, Input } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-show-details-tab",
  templateUrl: "./show-details-tab.component.html",
  styleUrls: ["./show-details-tab.component.scss"],
})
export class ShowDetailsTabComponent implements OnInit {
  @Input() showIn: any;
  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.helperService.isGlobalAddEnabled = true;
  }
}
