import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { ShowsService } from "../shows.service";
import { NzDrawerService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { ShowFormComponent } from "../../modals/show-form/show-form.component";
import { Router } from "@angular/router";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-show-list",
  templateUrl: "./show-list.component.html",
  styleUrls: ["./show-list.component.scss"],
})
export class ShowListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("showComp", { static: false }) showComp: any;
  isDataReady: boolean;
  isEmptyData: boolean;
  childDrawerRef: any;
  showList: any;
  showOut: any;
  showOutCopy: any;
  mode = "update";
  supervisorAvatarMax = AppConstants.SUPERVISOR_AVATAR_MAX;
  artistAvatarMax = AppConstants.ARTIST_AVATAR_MAX;
  subscription: Subscription;
  drawerTitle: any;

  shows = [];
  start = 0;
  end = -1;
  batch = 10;
  finished = false;
  dummyArtist = {
    firstName: "",
    id: -1,
    lastName: "",
  };

  constructor(
    private showsService: ShowsService,
    private drawerService: NzDrawerService,
    private notificationService: NotificationService,
    private router: Router,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.getShowList();
  }

  ngAfterViewInit() {
    //let parentDiv = this.showComp.nativeElement.offsetParent;
    /*this.showComp.nativeElement.offsetParent.addEventListener('scroll', e => {
      if ((e.srcElement.offsetHeight + e.srcElement.scrollTop) >= e.srcElement.scrollHeight) {
        if (!this.finished) {
          this.getShows();
        }
      }
    });*/
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

  getShows() {
    if (!this.showList) {
      return;
    }
    if (this.finished) {
      return;
    }
    this.start = this.end + 1;
    this.end = this.start + (this.batch - 1);
    this.shows = [
      ...this.shows,
      ...this.showList.slice(this.start, this.end + 1),
    ];
    if (this.end >= this.showList.length - 1) {
      this.end = this.showList.length - 1;
      this.finished = true;
    }
  }

  onScrollUp() {}

  onScrollDown() {
    this.getShows();
  }

  getShowList() {
    this.showsService.getShowList().subscribe(
      (resp) => {
        if (resp && resp.valid && resp.entity && resp.entity.length > 0) {
          this.showList = resp.entity;
          this.shows = this.showList;
          //this.getShows();
        } else {
          this.onDataError(resp);
        }
      },
      (error) => {
        this.onDataError(error);
      }
    );
  }

  getRemainingArtist(artists) {
    let remaining = "";
    if (artists.length > this.artistAvatarMax) {
      remaining = "+ " + (artists.length - this.artistAvatarMax);
    }
    return remaining;
  }

  getRemainingSupervisor(supervisors) {
    let remaining = "";
    if (supervisors.length > this.supervisorAvatarMax) {
      remaining = "+ " + (supervisors.length - this.supervisorAvatarMax);
    }
    return remaining;
  }

  getInProgressCount(show: any) {
    let key1 = "name";
    let key2 = "value";
    let value1 = AppConstants.WORK_IN_PROGRESS_CODE;
    return this.getStatusCount(show.workStatusCount, key1, value1, key2);
  }

  getCompletedCount(show: any) {
    let key1 = "name";
    let key2 = "value";
    let value1 = AppConstants.WORK_COMPLETED_CODE;
    return this.getStatusCount(show.workStatusCount, key1, value1, key2);
  }

  getStatusCount(objArr: any, key1: any, value1: any, key2: any) {
    if (objArr && objArr.length > 0) {
      return this.helperService.getValueInObject(objArr, key1, value1, key2);
    }
    return "0";
  }

  clickHandler(show: any) {
    let routerLink = this.router.url + "/" + show.id;
    this.router.navigate([routerLink]);
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  createShow() {
    this.drawerTitle = "Add Show";
    this.openShowForm("create", null);
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  async editHandler(show: any) {
    await this.getShow(show.id);
    if (this.showOut) {
      this.openShowForm("update", this.showOut);
    }
  }

  async getShow(id: any) {
    this.showOut = null;
    await this.showsService
      .getShow(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.showOut = resp.entity;
        }
      })
      .catch((error) => {});
  }

  getPercent(show: any) {
    if (show && show.completedPercentage) {
      return show.completedPercentage;
    }
    return 0;
  }

  openShowForm(mode: any, showOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      ShowFormComponent,
      { showOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShowFormComponent,
      nzContentParams: {
        showOut: showOut,
        mode: mode,
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.getShowList();
      }
    });
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }
}
