import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { NzDrawerRef, NzDrawerService, NzModalService } from "ng-zorro-antd";
import { RoleFormComponent } from "../role-form/role-form.component";
import { ShowFormComponent } from "../show-form/show-form.component";
import { ShotFormComponent } from "../shot-form/shot-form.component";
import { TaskFormComponent } from "../task-form/task-form.component";
import { SequenceFormComponent } from "../sequence-form/sequence-form.component";
import { SeasonFormComponent } from "../season-form/season-form.component";
import { EpisodeFormComponent } from "../episode-form/episode-form.component";
import { AssetFormComponent } from "../asset-form/asset-form.component";
import { GroupFormComponent } from "../group-form/group-form.component";
import { DepartmentFormComponent } from "../department-form/department-form.component";
import { TasktypeFormComponent } from "../tasktype-form/tasktype-form.component";
import { WorkstatusFormComponent } from "../workstatus-form/workstatus-form.component";
import { PriorityFormComponent } from "../priority-form/priority-form.component";
import { ClientFormComponent } from "../client-form/client-form.component";
import { SpotFormComponent } from "../spot-form/spot-form.component";
import { Router } from "@angular/router";
import { UserFormComponent } from "../user-form/user-form.component";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { CustomFieldFormComponent } from "../custom-field-form/custom-field-form.component";
import { PlaylistFormComponent } from "../playlist-form/playlist-form.component";
import { OfficeLocationFormComponent } from "../office-location-form/office-location-form.component";
import { ShotAssetStatusFormComponent } from "../shot-asset-status-form/shot-asset-status-form.component";

@Component({
  selector: "app-add-new",
  templateUrl: "./add-new.component.html",
  styleUrls: ["./add-new.component.scss"],
})
export class AddNewComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @Input() actionType = "";
  @Input() menuArr: any;
  isAlertVisible: boolean;
  childDrawerRef: any;
  titlePrefix = "Add New";
  titleSuffix = "";
  actionList = [];
  actionList_Unused = [
    {
      name: "Role",
      type: "role",
      isFavourite: true,
      link: "/configs/roles",
    },
    {
      name: "Show",
      type: "show",
      isFavourite: false,
      link: "/shows",
    },
    {
      name: "Shot",
      type: "shot",
      isFavourite: false,
      //link: "/shows"
    },
    {
      name: "Task",
      type: "task",
      isFavourite: true,
      //link: "/shows"
    },
    {
      name: "Sequence",
      type: "sequence",
      isFavourite: true,
      //link: "/shows"
    },
    {
      name: "Episode",
      type: "episode",
      isFavourite: true,
      //link: "/shows"
    },
    {
      name: "Season",
      type: "season",
      isFavourite: true,
      //link: "/shows"
    },
    {
      name: "Spot",
      type: "spot",
      isFavourite: true,
      //link: "/shows"
    },
    {
      name: "Asset",
      type: "asset",
      isFavourite: false,
      //link: "/shows"
    },
    {
      name: "Group",
      type: "group",
      isFavourite: false,
      link: "/configs/groups",
    },
    {
      name: "Department",
      type: "department",
      isFavourite: false,
      link: "/configs/departments",
    },
    {
      name: "Task Type",
      type: "tasktype",
      isFavourite: false,
      link: "/configs/tasktypes",
    },
    {
      name: "Work Status",
      type: "workstatus",
      isFavourite: false,
      link: "/configs/workstatus",
    },
    {
      name: "Task Priority",
      type: "taskpriority",
      isFavourite: false,
      link: "/configs/priorities",
    },
    {
      name: "Client",
      type: "client",
      isFavourite: false,
      link: "/configs/clients",
    },
    {
      name: "User",
      type: "user",
      isFavourite: false,
      link: "/configs/users",
    },
    {
      name: "Template",
      type: "template",
      isFavourite: false,
      link: "/configs/templates",
    },
  ];
  constructor(
    private router: Router,
    private drawerRef: NzDrawerRef<string>,
    private drawerService: NzDrawerService,
    private helperService: HelperService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.prepareMenuList();
  }

  prepareMenuList() {
    if (this.actionType === "add") {
    } else {
    }

    this.actionList = this.menuArr.map((item: any) => {
      item.name = item.actionName;
      item.type = item.actionName.toLowerCase().split(" ").join("");
      item.type = item.type.split("/").join("");
      item.link = this.getLink(item.type);
      return item;
    });

    console.log(this.actionList);
  }

  getLink(type: any) {
    return this.helperService.getLink(type);

    let linkInfo = {
      studio: "/configs/roles",
      role: "/configs/roles",
      user: "/configs/users",
      group: "/configs/groups",
      department: "/configs/departments",
      tasktype: "/configs/tasktypes",
      workstatus: "/configs/workstatus",
      priority: "/configs/priorities",
      client: "/configs/clients",
      template: "/configs/templates",
      show: "/shows",
      mytask: "/tasks",
      playlist: "/playlist",
      timesheet: "/time-sheet",
    };
    return linkInfo[type];
  }

  getItemList() {
    if (this.actionType === "add") {
      return this.actionList;
      return this.actionList.filter((item) => {
        if (item.type !== "template" && item.type !== "favourites") {
          return item;
        }
      });
    } else {
      return this.actionList.filter((item) => item.link);
    }
  }

  getIconType(action: any) {
    return "star";
  }

  getIconTheme(action: any) {
    return action.isFavourite ? "fill" : "outline";
  }

  clickHandler(item: any) {
    this.titleSuffix = item.name;
    if (this.actionType === "add") {
      let typeTitleCase =
        item.type.charAt(0).toUpperCase() + item.type.slice(1);
      let methodName = `open${typeTitleCase}Form`;
      this[methodName]();
      this.close();
    } else {
      this.navigatePage(item);
    }
  }

  navigatePage(item: any) {
    this.close();
    let routerLink = "/system/listing" + item.link;
    this.router.navigate([routerLink]);
  }

  onDataError(error: any) {
    console.log("<< onDataError >> " + error);
  }

  openRoleForm(): void {
    this.childDrawerRef = this.drawerService.create<
      RoleFormComponent,
      { roleOut: any; allPermissions: any; allReports: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: RoleFormComponent,
      nzContentParams: {
        roleOut: null,
        allPermissions: null,
        allReports: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Role Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Role Form Close" + data);
    });
  }

  openShowForm(): void {
    this.childDrawerRef = this.drawerService.create<
      ShowFormComponent,
      { showOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShowFormComponent,
      nzContentParams: {
        showOut: null,
        mode: "create",
      },
      nzClosable: false,
      //nzWidth: "30%",
      nzWidth: "500px",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Show Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Show Form Close" + data);
    });
  }

  openShotForm(): void {
    this.childDrawerRef = this.drawerService.create<
      ShotFormComponent,
      { shotOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShotFormComponent,
      nzContentParams: {
        shotOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "500px",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Shot Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Shot Form Close" + data);
    });
  }

  openTaskForm(): void {
    this.childDrawerRef = this.drawerService.create<
      TaskFormComponent,
      { taskOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TaskFormComponent,
      nzContentParams: {
        taskOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "500px",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Task Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Task Form Close");
    });
  }

  openSequenceForm(): void {
    this.childDrawerRef = this.drawerService.create<
      SequenceFormComponent,
      { sequenceOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: SequenceFormComponent,
      nzContentParams: {
        sequenceOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Sequence Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Sequence Form Close");
    });
  }

  openSeasonForm(): void {
    this.childDrawerRef = this.drawerService.create<
      SeasonFormComponent,
      { seasonOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: SeasonFormComponent,
      nzContentParams: {
        seasonOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Season Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Season Form Close");
    });
  }

  openSpotForm(): void {
    this.childDrawerRef = this.drawerService.create<
      SpotFormComponent,
      { spotOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: SpotFormComponent,
      nzContentParams: {
        spotOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Spot Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Spot Form Close");
    });
  }

  openEpisodeForm(): void {
    this.childDrawerRef = this.drawerService.create<
      EpisodeFormComponent,
      { episodeOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: EpisodeFormComponent,
      nzContentParams: {
        episodeOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Episode Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Episode Form Close");
    });
  }

  openAssetForm(): void {
    this.childDrawerRef = this.drawerService.create<
      AssetFormComponent,
      { assetOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: AssetFormComponent,
      nzContentParams: {
        assetOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "500px",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Asset Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Asset Form Close");
    });
  }

  openPlaylistForm(): void {
    this.childDrawerRef = this.drawerService.create<
      PlaylistFormComponent,
      { playlistType: any; playlistOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: PlaylistFormComponent,
      nzContentParams: {
        playlistType: null,
        playlistOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Episode Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Episode Form Close");
    });
  }

  openGroupForm(): void {
    this.childDrawerRef = this.drawerService.create<
      GroupFormComponent,
      { groupOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: GroupFormComponent,
      nzContentParams: {
        groupOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "50%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Group Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Group Form Close");
    });
  }

  openDepartmentForm(): void {
    this.childDrawerRef = this.drawerService.create<
      DepartmentFormComponent,
      { departmentOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: DepartmentFormComponent,
      nzContentParams: {
        departmentOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Department Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Department Form Close");
    });
  }

  openTasktypeForm(): void {
    this.childDrawerRef = this.drawerService.create<
      TasktypeFormComponent,
      { tasktypeOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TasktypeFormComponent,
      nzContentParams: {
        tasktypeOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Tasktype Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Tasktype Form Close");
    });
  }

  openWorkstatusForm(): void {
    this.childDrawerRef = this.drawerService.create<
      WorkstatusFormComponent,
      { workstatusOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: WorkstatusFormComponent,
      nzContentParams: {
        workstatusOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Workstatus Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Workstatus Form Close");
    });
  }

  openShotassetstatusForm(): void {
    this.childDrawerRef = this.drawerService.create<
      ShotAssetStatusFormComponent,
      { statusOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShotAssetStatusFormComponent,
      nzContentParams: {
        statusOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("ShotAssetStatus Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("ShotAssetStatus Form Close");
    });
  }

  openPriorityForm(): void {
    this.childDrawerRef = this.drawerService.create<
      PriorityFormComponent,
      { priorityOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: PriorityFormComponent,
      nzContentParams: {
        priorityOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Priority Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Priority Form Close");
    });
  }

  openClientForm(): void {
    this.childDrawerRef = this.drawerService.create<
      ClientFormComponent,
      { clientOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ClientFormComponent,
      nzContentParams: {
        clientOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("Client Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("Client Form Close");
    });
  }

  openUserForm(): void {
    this.childDrawerRef = this.drawerService.create<
      UserFormComponent,
      { userOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: UserFormComponent,
      nzContentParams: {
        userOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("User Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("User Form Close");
    });
  }

  openCustomfieldsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      CustomFieldFormComponent,
      { departmentOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: CustomFieldFormComponent,
      nzContentParams: {
        departmentOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("CustomField Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("CustomField Form Close");
    });
  }

  openOfficelocationForm(): void {
    this.childDrawerRef = this.drawerService.create<
      OfficeLocationFormComponent,
      { officeLocationOut: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: OfficeLocationFormComponent,
      nzContentParams: {
        officeLocationOut: null,
        mode: "create",
      },
      nzClosable: false,
      nzWidth: "30%",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
      console.log("OfficeLocation Form Open");
    });

    this.childDrawerRef.afterClose.subscribe((data) => {
      console.log("OfficeLocation Form Close");
    });
  }

  closeForm(): void {
    //this.isAlertVisible = true;
    this.childDrawerRef.close();
  }

  onConfirm() {
    this.isAlertVisible = false;
    this.childDrawerRef.close();
  }

  onCancel() {
    this.isAlertVisible = false;
  }

  close(): void {
    this.drawerRef.close(this.actionType);
  }
}
