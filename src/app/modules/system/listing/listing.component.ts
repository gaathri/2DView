import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd/drawer";
import { AddNewComponent } from "../modals/add-new/add-new.component";
import { InteractionService } from "../../core/services/interaction.service";
import { Subscription } from "rxjs";
import { HelperService } from "../../core/services/helper.service";

@Component({
  selector: "app-listing",
  templateUrl: "./listing.component.html",
  styleUrls: ["./listing.component.scss"],
})
export class ListingComponent implements OnInit, OnDestroy {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  drawerRef: any;
  listArr: any;
  iconDefaultColor = "white";
  subscription: Subscription;
  constructor(
    private router: Router,
    private drawerService: NzDrawerService,
    private interactionService: InteractionService,
    private helperService: HelperService
  ) {
    this.generateList();
  }

  ngOnInit() {
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe((interaction) => {});
    this.interactionService.sendInteraction("breadcrumb", "listing");
    this.helperService.isGlobalAddEnabled = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clickHandler = (item: any) => {
    let routerLink = this.router.url + item.link;

    if (item.link === "/add-new") {
      this.openDrawer("add");
    } else {
      this.router.navigate([routerLink]);
    }
  };

  openDrawer(actionType: string): void {
    this.drawerRef = this.drawerService.create<
      AddNewComponent,
      { actionType: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: AddNewComponent,
      nzContentParams: {
        actionType: actionType,
      },
      nzClosable: false,
      nzWrapClassName: "modal-wrapper",
      nzWidth: "25%",
    });

    this.drawerRef.afterOpen.subscribe(() => {});

    this.drawerRef.afterClose.subscribe((data) => {});
  }

  closeAddNewForm(): void {
    this.drawerRef.close();
  }

  close(): void {
    this.drawerRef.close();
  }

  generateList = () => {
    this.listArr = [
      {
        title: "Show Listing",
        icon: "work",
        link: "/shows",
      },
      {
        title: "User Listing",
        icon: "supervisor_account",
        link: "/configs/users",
      },
      /*{
        title: "Task Listing",
        icon: "list"
      },*/
      {
        title: "Role Listing",
        icon: "list",
        link: "/configs/roles",
      },
      {
        title: "Department Listing",
        icon: "group_work",
        link: "/configs/departments",
      },
      {
        title: "Group Listing",
        icon: "group",
        link: "/configs/groups",
      },
      {
        title: "Template Listing",
        icon: "insert_drive_file",
        link: "/configs/templates",
      },
      {
        title: "Priority Listing",
        icon: "star_half",
        link: "/configs/priorities",
      },
      {
        title: "Client Listing",
        icon: "assignment_ind",
        link: "/configs/clients",
      },
      {
        title: "Work Status Listing",
        icon: "assignment_ind",
        link: "/configs/workstatus",
      },
      {
        title: "Task Type Listing",
        icon: "assignment_ind",
        link: "/configs/tasktypes",
      },
      {
        title: "Add New",
        icon: "add_circle_outline",
        iconColor: "gray",
        link: "/add-new",
      },
    ];

    // for (let i = 0; i < this.listArr.length; i++) {
    //   this.listArr[i].link = '/' + this.listArr[i].title.split(' ')[0].toLowerCase()+'s';
    // }
  };
}
