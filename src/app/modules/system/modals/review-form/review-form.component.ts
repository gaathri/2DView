import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-review-form",
  templateUrl: "./review-form.component.html",
  styleUrls: ["./review-form.component.scss"],
})
export class ReviewFormComponent implements OnInit {
  @Input() playlistId: any;
  //@Input() playlistInfo: any;
  //@Input() revisionInfo: any;
  @Input() rowIndex: any;

  constructor(private drawerRef: NzDrawerRef<string>) {}

  ngOnInit() {}

  reviewClose(event: any) {
    let isReviewUpdated = false;
    if (event && event.isReviewUpdated) {
      isReviewUpdated = event.isReviewUpdated;
    }
    this.close(isReviewUpdated);
  }

  reviewComplete(event: any) {
    this.close(true);
  }

  close(isSuccess: any): void {
    this.drawerRef.close(isSuccess);
  }
}
