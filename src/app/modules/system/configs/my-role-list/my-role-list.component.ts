import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import {
  NzDrawerRef,
  NzMessageService,
  NzDrawerService,
  NzModalService,
} from "ng-zorro-antd";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { RolesService } from "../roles.service";
import { RoleFormComponent } from "../../modals/role-form/role-form.component";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { Page } from "src/app/modules/shared/model/page";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-my-role-list",
  templateUrl: "./my-role-list.component.html",
  styleUrls: ["./my-role-list.component.scss"],
})
export class MyRoleListComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("myTable", { static: false }) table: any;
  childDrawerRef: any;
  showDummy: boolean;
  isDataReady: boolean;
  page = new Page();
  currPageInfo: any;
  selectedPageSize: any;
  pageSizeOptions: any;

  rows = new Array();
  selected = [];

  loading = false;
  isLoading: boolean = true;
  isEmptyData: boolean;
  value = {
    clientCode: 1,
    clientName: "Hari",
  };

  panels = [
    {
      active: false,
      name: "This is panel header 1",
      disabled: false,
    },
  ];

  isVisible = false;
  isConfirmLoading = false;
  isAccessPermissionsVisible = false;
  modalTitle = "";

  isAlertVisible = false;
  roleToDelete = null;

  roleNameMaxLength = 64;
  roleDescMaxLength = 256;
  allPermissions: any;
  allReports: any;
  roleOut: any;
  roleOutCopy: any;
  permissionsArr: Array<any>;
  validateForm: FormGroup;
  message: string;
  isFormReady = false;
  grantsArray = [
    {
      id: "isRead",
      title: "Read",
    },
    {
      id: "isWrite",
      title: "Full Access",
    },
  ];

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;

  roleToToggle: any;
  isToggleAlertVisible: boolean;
  isReadOnly: boolean;

  functionalGroup: any;
  privilegeInfo: any;
  limitPermissions: boolean;

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private interactionService: InteractionService,
    private helperService: HelperService
  ) {
    /*this.page.pageNumber = 0;
    this.page.size = 5;*/

    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    //this.interactionService.sendInteraction("breadcrumb", "role listing");
    this.interactionService.sendInteraction("breadcrumb", "hide_breadcrumb");
    /*this.helperService.isGlobalAddEnabled = false;
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        if (interaction.type === "global-add") {
          this.createRole();
        }
      });*/
    //this.roleOut = { "roleName": "ABCD", "roleDesc": "XYZ", "permissions": [{ "actionId": 1, "isRead": true, "isWrite": false }, { "actionId": 2, "isRead": true, "isWrite": false }, { "actionId": 3, "isRead": true, "isWrite": false }, { "actionId": 4, "isRead": true, "isWrite": false }, { "actionId": 5, "isRead": true, "isWrite": false }, { "actionId": 6, "isRead": true, "isWrite": false }, { "actionId": 7, "isRead": true, "isWrite": false }, { "actionId": 8, "isRead": true, "isWrite": false }, { "actionId": 9, "isRead": true, "isWrite": false }, { "actionId": 10, "isRead": true, "isWrite": false }, { "actionId": 11, "isRead": true, "isWrite": false }, { "actionId": 13, "isRead": true, "isWrite": true }, { "actionId": 14, "isRead": false, "isWrite": true }, { "actionId": 15, "isRead": false, "isWrite": true }, { "actionId": 16, "isRead": false, "isWrite": true }, { "actionId": 17, "isRead": false, "isWrite": true }, { "actionId": 18, "isRead": false, "isWrite": true }, { "actionId": 19, "isRead": false, "isWrite": true }, { "actionId": 20, "isRead": false, "isWrite": true }, { "actionId": 21, "isRead": false, "isWrite": true }, { "actionId": 22, "isRead": false, "isWrite": true }, { "actionId": 23, "isRead": false, "isWrite": true }, { "actionId": 24, "isRead": false, "isWrite": true }, { "actionId": 25, "isRead": false, "isWrite": true }], "reports": [1, 2, 3, 4, 5, 6, 7, 8, 9] };
    this.prepareData();
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.ROLE
    );
  }

  async prepareData() {
    await this.getActionList();
    await this.getReportList();
    await this.getFunctionalGroup();
    this.isDataReady = true;
  }

  isEditable(row?: any) {
    if (this.isReadOnly) {
      return false;
    }
    if (row && row.isPredefined) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0,
    };
    this.setPage(pageInfo);
  }

  getActionList(): void {
    this.rolesService.getActionList().subscribe(
      (resp) => {
        if (resp && resp.valid && resp.entity) {
          this.allPermissions = resp.entity;
        }
      },
      (error) => {
        this.onDataError(error);
      }
    );
  }

  getReportList(): void {
    this.rolesService.getReportList().subscribe(
      (resp) => {
        if (resp && resp.valid && resp.entity) {
          this.allReports = resp.entity;
        }
      },
      (error) => {
        this.onDataError(error);
      }
    );
  }

  async getFunctionalGroup() {
    this.functionalGroup = [];

    await this.rolesService
      .getFunctionalGroup()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.valid && resp.entity) {
          this.functionalGroup = resp.entity;
          this.addGroupInfo();
        }
      })
      .catch((error: any) => {});
  }

  async getPrivilegeInfo(privilegeId) {
    await this.rolesService
      .getPrivilegeInfo(privilegeId)
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.valid && resp.entity) {
          this.privilegeInfo = resp.entity;
        }
      })
      .catch((error: any) => {});
  }

  isPermissionDisabled(index: any) {
    if (!this.limitPermissions) {
      return false;
    }
    if (this.isPermissionPresent(this.allPermissions[index].id)) {
      return false;
    }
    return true;
  }

  isReportDisabled(index: any) {
    if (!this.limitPermissions) {
      return false;
    }
    if (this.isReportPresent(this.allReports[index].id)) {
      return false;
    }
    return true;
  }

  isReportPresent(id) {
    if (
      this.privilegeInfo &&
      this.privilegeInfo.reports &&
      this.helperService.isValidArr(this.privilegeInfo.reports)
    ) {
      if (this.privilegeInfo.reports.includes(id)) {
        return true;
      }
    } else {
      return false;
    }
  }

  isPermissionPresent(id) {
    if (
      this.privilegeInfo &&
      this.privilegeInfo.permissions &&
      this.helperService.isValidArr(this.privilegeInfo.permissions)
    ) {
      let info = this.helperService.findObjectInArrayByKey(
        this.privilegeInfo.permissions,
        "actionId",
        id
      );
      if (info) {
        return true;
      }
    } else {
      return false;
    }
  }

  addGroupInfo() {
    let item = null;
    for (let i = 0; i < this.allPermissions.length; i++) {
      item = this.allPermissions[i];
      let group = this.getGroupInfo(item.id, item.actionName);
      item.functionalGroupName = group.functionalGroupName;
      item.groupId = group.groupId;
    }
    this.allPermissions.sort(function (a, b) {
      return a.groupId - b.groupId;
    });
  }

  isNewGroup(i) {
    if (i > 0) {
      if (
        this.allPermissions[i - 1].groupId != this.allPermissions[i].groupId
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  getGroupInfo_(id, actionName) {
    let info = {
      functionalGroupName: "Others",
      groupId: 100,
    };
    for (let i = 0; i < this.functionalGroup.length; i++) {
      for (let j = 0; j < this.functionalGroup[i].actions.length; j++) {
        let item = this.functionalGroup[i].actions[j];
        if (item.id == id && item.actionName == actionName) {
          info.groupId = this.functionalGroup[i].id;
          info.functionalGroupName = this.functionalGroup[
            i
          ].functionalGroupName;
          break;
        }
      }
    }
    return info;
  }

  getGroupInfo(id, actionName) {
    let info = {
      functionalGroupName: "Others",
      groupId: 100,
    };
    for (let i = 0; i < this.functionalGroup.length; i++) {
      if (
        this.functionalGroup[i] &&
        this.functionalGroup[i].actions &&
        this.helperService.isValidArr(this.functionalGroup[i].actions)
      ) {
        for (let j = 0; j < this.functionalGroup[i].actions.length; j++) {
          let item = this.functionalGroup[i].actions[j];
          if (item.id == id && item.actionName == actionName) {
            info.groupId = this.functionalGroup[i].id;
            info.functionalGroupName = this.functionalGroup[
              i
            ].functionalGroupName;
            break;
          }
        }
      }
    }
    return info;
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  searchHandler() {
    this.isSearching = true;
  }

  searchDetails() {
    if (this.searchPattern == "") {
      this.isSearching = false;
    }
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  searchBlur() {
    if (this.searchPattern == "") {
      this.isSearching = false;
      this.currPageInfo.offset = 0;
      this.setPage(this.currPageInfo);
    }
  }

  clearSearch() {
    this.searchPattern = "";
    this.isSearching = false;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  setPage(pageInfo: any) {
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;

    this.rolesService.getRoleList(this.page).subscribe(
      (resp) => {
        if (resp && resp.valid /* && resp.coll && resp.coll.length > 0*/) {
          this.page.totalElements = resp.total;
          this.page.totalPages = Math.ceil(resp.total / this.page.size);
          this.rows = resp.coll;
          setTimeout(() => {
            try {
              let parentHeight = this.table.bodyComponent.scroller.parentElement.getBoundingClientRect()
                .height;
              let childHeight = this.table.bodyComponent.scroller.element.getBoundingClientRect()
                .height;
              if (childHeight > parentHeight) {
                this.showDummy = false;
              } else {
                this.showDummy = true;
              }
            } catch (e) {}
          }, 500);
        } else {
          this.rows = null;
          this.onDataError(resp);
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.onDataError(error);
      }
    );
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {}

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  createRole() {
    this.drawerTitle = "Add Role";
    this.openRoleForm("create", null);
  }

  async cloneHandler(row: any) {
    let successMessage = "Role has been successfully cloned.";
    let errorMessage = "Role clone failed.";

    await this.rolesService
      .cloneRole(row.id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid) {
          this.setPage(this.currPageInfo);
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        }
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  async editHandler(role: any) {
    await this.getRole(role.id);
    if (this.roleOut) {
      this.drawerTitle = "Edit Role";
      this.openRoleForm("update", this.roleOut);
    }
  }

  async getRole(id: any) {
    this.roleOut = null;
    await this.rolesService
      .getRole(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.roleOut = resp.entity;
        }
      })
      .catch((error) => {});
  }
  deleteHandler(role: any) {
    this.isAlertVisible = true;
    this.roleToDelete = role;
  }

  deleteRoleConfirm = async () => {
    let successMessage = "Role has been successfully deleted.";
    let errorMessage = "Role deletion failed.";
    this.isAlertVisible = false;
    await this.rolesService
      .deleteRole(this.roleToDelete.id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        if (this.currPageInfo.offset > 0 && this.rows.length == 1) {
          this.currPageInfo.offset = this.currPageInfo.offset - 1;
        }
        this.setPage(this.currPageInfo);
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  };

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  deleteRoleCancel = () => {
    this.isAlertVisible = false;
  };

  openRoleForm(mode: any, roleOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      RoleFormComponent,
      { roleOut: any; allPermissions: any; allReports: any; mode: string },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: RoleFormComponent,
      nzContentParams: {
        roleOut: roleOut,
        allPermissions: this.allPermissions,
        allReports: this.allReports,
        mode: mode,
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
            //nzCancelType: "primary",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.setPage(this.currPageInfo);
      }
    });
  }

  closeRoleForm(): void {
    this.childDrawerRef.close();
  }

  async showPermissions(id: any, type: string) {
    await this.getRole(id);

    this.limitPermissions = false;

    let privilegeId = this.roleOut.rolePrivilegeId;
    if (
      privilegeId === AppConstants.CLIENT_PRIVILEGE_ID ||
      privilegeId === AppConstants.ARTIST_PRIVILEGE_ID ||
      privilegeId === AppConstants.HR_PRIVILEGE_ID
    ) {
      this.limitPermissions = true;
      await this.getPrivilegeInfo(privilegeId);
    }

    this.prepareFormData();
    this.buildRoleForm();
    this.modalTitle = `${type} Permissions - ${this.roleOut.roleName}`;
    this.isAccessPermissionsVisible = false;
    if (type === "Access") {
      this.isAccessPermissionsVisible = true;
    }
    this.showModal();
  }

  // showAccessPermissions(id:any) {
  //   this.isAccessPermissionsVisible = true;
  //   this.modalTitle = 'Access Permissions';
  //   this.showModal();
  // }

  // showReportPermissions(id:any) {
  //   this.isAccessPermissionsVisible = false;
  //   this.modalTitle = 'Report Permissions';
  //   this.showModal();
  // }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    this.submitForm();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  prepareFormData() {
    if (!this.roleOut) {
      this.roleOut = {
        roleName: "",
        roleDesc: "",
        permissions: [],
        reports: [],
      };
    }
    this.roleOutCopy = JSON.parse(JSON.stringify(this.roleOut));
  }
  buildRoleForm() {
    this.isFormReady = false;
    this.validateForm = this.fb.group({
      roleName: [this.roleOutCopy.roleName, [Validators.required]],
      roleDesc: [this.roleOutCopy.roleDesc],
      permissions: this.buildPermissionForm(),
      reports: this.buildReportsFormGroup(),
    });
    this.isFormReady = true;
  }

  get f() {
    return this.validateForm && this.validateForm.controls;
  }

  buildPermissionForm(): FormArray {
    const permissionsArray = new FormArray([]);
    for (let i = 0; i < this.allPermissions.length; i++) {
      let actionType = "";
      let isSelected = false;
      if (
        this.roleOutCopy.permissions &&
        this.roleOutCopy.permissions.length > 0
      ) {
        isSelected = this.roleOutCopy.permissions.some((item) => {
          if (item.actionId === this.allPermissions[i].id) {
            actionType = item.actionType;
            return true;
          } else {
            return false;
          }
        });
      }
      const permissionGroup = new FormGroup({
        isSelected: new FormControl(isSelected),
        actionId: new FormControl(this.allPermissions[i].id),
        actionType: new FormControl(actionType),
      });

      permissionsArray.push(permissionGroup);
    }
    return permissionsArray;
  }

  buildReportsFormGroup(): FormGroup {
    let group = this.fb.group({}, {});
    this.allReports.forEach((report) => {
      let isSelected = false;
      if (this.roleOutCopy.reports && this.roleOutCopy.reports.length > 0) {
        isSelected = this.roleOutCopy.reports.some((id) => id === report.id);
      }
      group.addControl(report.id, this.fb.control(isSelected));
    });
    return group;
  }

  getRolePermissions() {
    let rolePermissions = [];
    this.validateForm.value.permissions.map((item) => {
      if (item.isSelected && item.actionType !== "") {
        rolePermissions.push(item);
      }
    });
    return rolePermissions;
  }

  getRoleReports() {
    let roleReports = [];
    for (let i = 0; i < this.allReports.length; i++) {
      let id = this.allReports[i].id;
      let reportInfo = this.validateForm.value.reports;
      if (reportInfo[id]) {
        roleReports.push(id);
      }
    }
    return roleReports;
  }

  /** HTML Template methods start */

  getReportsFormGroup() {
    return this.f && <FormGroup>this.f.reports;
  }

  getDisabledFlag(permission) {
    //let checked = this.getCheckededFlag(permission,grantId);
    if (this.isReadOnly) {
      return true;
    }
    if (this.roleOut && this.roleOut.isPredefined) {
      return true;
    }
    return !permission.value.isSelected;
  }

  getCheckededFlag(permission, grantId) {
    if (permission.value.isSelected) {
      if (permission.value.actionType === "") {
        permission.value.actionType = "isRead";
      }
      if (grantId === permission.value.actionType) {
        return true;
      } else {
        return false;
      }
    } else {
      permission.value.actionType = "";
      return false;
    }
  }

  accessCheckChangeHandler(permission) {
    if (permission.value.isSelected) {
      if (permission.value.actionType === "") {
        permission.value.actionType = "isRead";
      }
    } else {
      permission.value.actionType = "";
      //return "";
      //return false;
    }
    //return permission.value.actionType;
  }

  async submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.roleOutCopy.roleName = this.validateForm.value.roleName;
      this.roleOutCopy.roleDesc = this.validateForm.value.roleDesc;
      this.roleOutCopy.permissions = this.getRolePermissions();
      this.roleOutCopy.reports = this.getRoleReports();
      let successMessage = AppConstants.ROLE_MODIFICATION_SUCCESS;
      let errorMessage = AppConstants.ROLE_MODIFICATION_ERROR;
      await this.rolesService
        .updateRole(this.roleOutCopy)
        .toPromise()
        .then((resp: any) => {
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
          this.setPage(this.currPageInfo);
        })
        .catch((error: any) => {
          let errorDetails = this.helperService.getErrorDetails(error);
          if (errorDetails !== "") {
            errorMessage = `<b>${errorMessage}</b>` + errorDetails;
          }
          this.showNotification({
            type: "error",
            title: "Error",
            content: errorMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        });
      //this.isConfirmLoading = false;
      //this.isVisible = false;
    }
    this.isConfirmLoading = false;
    this.isVisible = false;
  }

  getActiveStatus(row: any, col: any) {
    //return "INACTIVE";
    return row && col && col.prop && row[col.prop] === 1
      ? "ACTIVE"
      : "INACTIVE";
  }

  onToggleIconClick(row: any): void {
    if (this.isEditable(row)) {
      this.isToggleAlertVisible = true;
      this.roleToToggle = row;
    }
  }

  toggleRoleConfirm = async () => {
    let actionSuccess =
      this.roleToToggle.isActive === 1 ? "deactivated" : "activated";
    let actionFail =
      this.roleToToggle.isActive === 1 ? "deactivation" : "activation";
    let successMessage = `Role has been successfully ${actionSuccess}.`;
    let errorMessage = `Role ${actionFail} failed.`;
    this.isToggleAlertVisible = false;
    await this.rolesService
      .toggleActivate(this.roleToToggle.id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.setPage(this.currPageInfo);
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  };

  toggleRoleCancel = () => {
    this.isToggleAlertVisible = false;
  };

  getToggleTitle() {
    let action =
      this.roleToToggle && this.roleToToggle.isActive === 1
        ? "deactivate"
        : "activate";
    return `Are you sure to ${action} this role?`;
  }

  /** HTML Template methods start */
}
