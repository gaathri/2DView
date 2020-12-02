import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { AnnotationComponent } from "../annotation/annotation.component";
import { NotesComponent } from "../notes/notes.component";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { PlaylistService } from "src/app/modules/system/playlist/playlist.service";

@Component({
  selector: "app-review-screen",
  templateUrl: "./review-screen.component.html",
  styleUrls: ["./review-screen.component.scss"],
})
export class ReviewScreenComponent implements OnInit {
  @Input() playlistId: any;
  @Input() rowIndex: any;

  @Output("onReviewClose")
  reviewClose: EventEmitter<any> = new EventEmitter<any>();

  @Output("onReviewComplete")
  reviewComplete: EventEmitter<any> = new EventEmitter<any>();
  revisionId: any;

  @ViewChild(AnnotationComponent, { static: false })
  annotationComponent: AnnotationComponent;
  @ViewChild(NotesComponent, { static: false }) notesComponent: NotesComponent;

  revisionInfo: any;
  count = 0;
  isFirst: boolean;
  isLast: boolean;

  isNotesReady: boolean;
  rightPanelHeight: any;

  constructor(
    private playlistService: PlaylistService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.setPage();
    // setTimeout(() => {
    //   let leftPanel = document.getElementsByClassName("left-panel")[0];
    //   if (leftPanel) {
    //     let leftPanelHeight = leftPanel.clientHeight;

    //   }
    // }, 500);
  }

  setPage() {
    this.isNotesReady = false;
    let pageNo = this.rowIndex;
    let params = `search=&pageNo=${pageNo}&pageSize=1&sortBy=&orderBy=`;
    this.isFirst = false;
    this.isLast = false;
    if (pageNo === 0) {
      this.isFirst = true;
    }

    this.playlistService
      .getVersionsByPlaylist(this.playlistId, params)
      .subscribe(
        (resp) => {
          if (resp && resp.valid) {
            this.count = resp.total;
            if (this.count > 0 && pageNo === this.count - 1) {
              this.isLast = true;
            }
            this.revisionInfo = resp.coll[0];
            if (this.annotationComponent) {
              this.annotationComponent.prepareData(this.revisionInfo);
            }
            this.isNotesReady = true;
            this.setRightPanelHeight();
          }
        },
        (error) => {}
      );
  }

  annotationInit(event: any) {
    this.setRightPanelHeight();
  }

  getRightPanelHeight() {
    if (this.hasReviewPermission()) {
      if (this.rightPanelHeight) {
        return this.rightPanelHeight + "px";
      }
    }
    return "auto";
  }

  setRightPanelHeight() {
    let leftPanel = document.getElementsByClassName("left-panel")[0];
    if (leftPanel) {
      let leftPanelHeight = leftPanel.clientHeight;
      this.rightPanelHeight = leftPanelHeight;
    }

    // setTimeout(() => {
    //   let leftPanel = document.getElementsByClassName("left-panel")[0];
    //   if (leftPanel) {
    //     let leftPanelHeight = leftPanel.clientHeight;
    //     this.rightPanelHeight = leftPanelHeight;
    //   }

    // }, 2000);
  }

  getImageData(event: any) {
    if (this.annotationComponent && this.annotationComponent.saveImg) {
      this.notesComponent.setAnnotationImage(
        this.annotationComponent.saveImg()
      );
    } else {
      this.notesComponent.setAnnotationImage(null);
    }
  }

  annotationClose(event: any) {
    this.reviewClose.emit(event);
  }

  annotationComplete(event: any) {
    this.reviewComplete.emit(null);
  }

  updateReviewComment(event: any) {
    this.notesComponent.updateReviewComment(event);
  }

  hasReviewPermission() {
    return !this.helperService.isReadOnly(AppConstants.PERMISSIONS.SCREENING);
  }

  getNext(e: any) {
    this.rowIndex++;
    this.setPage();
  }

  getPrev(e: any) {
    this.rowIndex--;
    this.setPage();
  }
}
