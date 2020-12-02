import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef, NzMessageService } from "ng-zorro-antd";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { RolesService } from "../../configs/roles.service";

@Component({
  selector: "app-role-form",
  templateUrl: "./role-form.component.html",
  styleUrls: ["./role-form.component.scss"],
})
export class RoleFormComponent implements OnInit {
  @Input() value = "";
  @Input() allPermissions: any;
  @Input() allReports: any;
  @Input() roleOut: any;
  @Input() roleOutCopy: any;
  @Input() mode: any;
  roleNameMaxLength = 64;
  roleDescMaxLength = 256;
  roleForm: FormGroup;
  permissionsArr: Array<any>;
  limitPermissions: boolean;

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

  permissionPanel = {
    active: false,
    disabled: false,
    name: "Click here to provide Access Permissions",
    customStyle: {
      background: "#f7f7f7",
      "border-radius": "4px",
      "margin-bottom": "24px",
      border: "0px",
    },
  };

  reportPanel = {
    active: false,
    disabled: false,
    name: "Click here to provide Report Permissions",
    customStyle: {
      background: "#f7f7f7",
      "border-radius": "4px",
      "margin-bottom": "24px",
      border: "0px",
    },
  };
  btnName: any;

  isDataReady: boolean;
  functionalGroup = [];
  privilegeInfo: any;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private rolesService: RolesService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.limitPermissions = false;
    this.prepareData();
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

  async prepareData() {
    if (!this.allPermissions) {
      await this.getActionList();
      await this.getFunctionalGroup();
    }

    console.log(this.allPermissions);

    if (this.mode === "update") {
      let privilegeId = this.roleOut.rolePrivilegeId;
      if (
        privilegeId === AppConstants.CLIENT_PRIVILEGE_ID ||
        privilegeId === AppConstants.ARTIST_PRIVILEGE_ID ||
        privilegeId === AppConstants.HR_PRIVILEGE_ID
      ) {
        this.limitPermissions = true;
        await this.getPrivilegeInfo(privilegeId);
      }
    }

    if (!this.allReports) {
      await this.getReportList();
    }

    this.prepareFormData();
    this.buildForm();
    this.isDataReady = true;
  }

  async getActionList() {
    this.allPermissions = [];
    await this.rolesService
      .getActionList()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.valid && resp.entity) {
          this.allPermissions = resp.entity;
        }
      })
      .catch((error: any) => {});
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

  async getReportList() {
    this.allReports = [];
    await this.rolesService
      .getReportList()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.valid && resp.entity) {
          this.allReports = resp.entity;
        }
      })
      .catch((error: any) => {});
  }

  get f() {
    return this.roleForm && this.roleForm.controls;
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

  buildForm() {
    this.roleForm = this.fb.group({
      roleName: [
        this.roleOutCopy.roleName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      roleDesc: [this.roleOutCopy.roleDesc],
      permissions: this.buildPermissionForm(),
      reports: this.buildReportsFormGroup(),
    });
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
    this.roleForm.value.permissions.map((item) => {
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
      let reportInfo = this.roleForm.value.reports;
      if (reportInfo[id]) {
        roleReports.push(id);
      }
    }
    return roleReports;
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }

  /** HTML Template methods start */

  getReportsFormGroup() {
    return this.f && <FormGroup>this.f.reports;
  }

  getDisabledFlag(permission) {
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

  async submitHandler() {
    for (const i in this.roleForm.controls) {
      this.roleForm.controls[i].markAsDirty();
      this.roleForm.controls[i].updateValueAndValidity();
    }
    if (this.roleForm.valid) {
      this.roleOutCopy.roleName = this.roleForm.value.roleName;
      this.roleOutCopy.roleDesc = this.roleForm.value.roleDesc;
      this.roleOutCopy.permissions = this.getRolePermissions();
      this.roleOutCopy.reports = this.getRoleReports();
      let successMessage = AppConstants.ROLE_CREATION_SUCCESS;
      let errorMessage = AppConstants.ROLE_CREATION_ERROR;
      let serviceName = "createRole";
      let isSuccess = false;
      if (this.mode === "update") {
        successMessage = AppConstants.ROLE_MODIFICATION_SUCCESS;
        errorMessage = AppConstants.ROLE_MODIFICATION_ERROR;
        serviceName = "updateRole";
      }
      await this.rolesService[serviceName](this.roleOutCopy)
        .toPromise()
        .then((resp: any) => {
          isSuccess = true;
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
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
      this.close(isSuccess);
    }
  }

  /** HTML Template methods start */
}
