import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.scss"],
})
export class ProgressComponent implements OnInit {
  @Input() percentage: any;
  @Input() config: any;

  showInfo: boolean = false;
  type: string = "line";
  strokeLinecap: string = "square";
  strokeWidth = 16;
  strokeColor: string = "#3be582";
  formatTwo = (percent: number) => `${percent}%`;
  constructor() {}

  ngOnInit() {
    if (this.config) {
      this.showInfo = this.config.showInfo;
      this.type = this.config.type;
      this.strokeLinecap = this.config.strokeLinecap;
      this.strokeWidth = this.config.strokeWidth
        ? this.config.strokeWidth
        : this.strokeWidth;
      this.strokeColor = this.config.strokeColor;
    }
  }

  canShow() {
    if (!isNaN(this.percentage) && this.percentage > -1) {
      return true;
    }
  }

  getStrokeColor() {
    if (this.config) {
      if (this.config.strokeColor) {
        this.strokeColor = this.config.strokeColor;
      }
    }
    return this.strokeColor;
  }
}
