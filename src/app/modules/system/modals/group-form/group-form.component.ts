import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NzDrawerRef, NzDrawerService, UploadChangeParam } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { GroupAssignUsersComponent } from "../group-assign-users/group-assign-users.component";
import { GroupsService } from "../../configs/groups.service";
import { RolesService } from "../../configs/roles.service";
import { NgForm, Validators } from "@angular/forms";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";

@Component({
  selector: "app-group-form",
  templateUrl: "./group-form.component.html",
  styleUrls: ["./group-form.component.scss"],
})
export class GroupFormComponent implements OnInit {
  @ViewChild("linkDrawerHeader", { static: false })
  linkDrawerHeader: TemplateRef<{}>;

  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;

  @Input() groupOut: any;
  @Input() groupOutCopy: any;
  @Input() mode: any;
  isDataReady: boolean;
  title: string;
  childDrawerRef: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  linkInfo = [
    { id: 1, title: "Assign Users", type: "users", modaltitle: "Assign Users" },
  ];
  mandatoryErrorInfo: any;
  btnName: string = "";
  role: any;
  users: any;
  roles: any;
  userIds: any;
  userDetails: any;
  itemName = AppConstants.itemNameRE;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private drawerService: NzDrawerService,
    private helperService: HelperService,
    private groupsService: GroupsService,
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
    this.updateUserDetails(this.groupOutCopy.userVOs);
  }

  async prepareData() {
    if (!this.groupOut) {
      this.groupOut = {
        groupName: "",
        groupDesc: "",
        thumbnail: "",
        userIds: [],
        userVOs: {},
      };
    }
    this.groupOutCopy = JSON.parse(JSON.stringify(this.groupOut));
    await this.getRoleList();
    this.isDataReady = true;
  }

  linkClickHandler(link: any) {
    this.title = link.modaltitle;
    this.openFrom(link.type);
  }

  getInputError() {
    let inputError = "";
    let mandatoryStrings = ["groupName"];
    inputError = this.helperService.getInvalidMandatoryStrings(
      this.groupOutCopy,
      mandatoryStrings
    );
    if (inputError === "") {
      let anyoneMandatoryArrays = ["userIds"];
      let isValid = this.helperService.isAnyoneMandatoryArraysFilled(
        this.groupOutCopy,
        anyoneMandatoryArrays
      );
      if (!isValid) {
        inputError = anyoneMandatoryArrays.join(" | ");
      }
    }
    return inputError;
  }

  isPatternError(value: any) {
    let patt = new RegExp(AppConstants.itemNameRE);
    let isValid = patt.test(value);
    return !isValid;
  }

  openFrom(type: string): void {
    if (type === "users") {
      this.childDrawerRef = this.drawerService.create<
        GroupAssignUsersComponent,
        { mode: string; groupOutCopy: any },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: GroupAssignUsersComponent,
        nzContentParams: {
          mode: this.mode,
          groupOutCopy: this.groupOutCopy,
        },
        nzClosable: false,
        nzWidth: "50%",
        nzWrapClassName: "modal-wrapper",
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {
        this.clearErrorInfo();
      });
    }
  }

  onChange($event: any): void {
    this.clearErrorInfo();
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  _myForm: NgForm;
  submitHandler(myForm: NgForm) {
    this._myForm = myForm;
    if (this.imageUploadComponent.isChanged) {
      this.imageUploadComponent.handleUpload();
    } else {
      this.submitForm();
    }
  }

  async submitForm() {
    let myForm = this._myForm;
    const groupNamecontrol = myForm.controls["groupName"];
    if (groupNamecontrol) {
      const errors = groupNamecontrol.errors;
      if (!errors) {
        //do nothing.
      } else {
        groupNamecontrol.markAsTouched();
        groupNamecontrol.updateValueAndValidity();
        //return;
      }
    }

    /*let isInvalidPattern = this.isPatternError(this.groupOutCopy.groupName);
    if (isInvalidPattern) {
      this.mandatoryErrorInfo = {
        title: "Group Name : " + AppConstants.PATTERN_ERROR,
        subTitle: "Pattern mismatch",
      };
      return;
    }*/

    this.frameUserIds();
    let inputError = this.getInputError();
    if (inputError !== "") {
      const userIdscontrol = myForm.controls["userIds"];
      const rolecontrol = myForm.controls["role"];
      if (userIdscontrol) {
        userIdscontrol.setValidators(Validators.required);
        userIdscontrol.markAsTouched();
        userIdscontrol.updateValueAndValidity();
      }

      if (rolecontrol) {
        rolecontrol.setValidators(Validators.required);
        rolecontrol.markAsTouched();
        rolecontrol.updateValueAndValidity();
      }

      this.mandatoryErrorInfo = {
        title: AppConstants.MANDATORY_ERROR,
        subTitle: "Data missing : " + inputError,
      };
    } else {
      let successMessage = AppConstants.GROUP_CREATION_SUCCESS;
      let errorMessage = AppConstants.GROUP_CREATION_ERROR;
      let serviceName = "createGroup";
      let isSuccess = false;
      if (this.mode === "update") {
        successMessage = AppConstants.GROUP_MODIFICATION_SUCCESS;
        errorMessage = AppConstants.GROUP_MODIFICATION_ERROR;
        serviceName = "updateGroup";
      }
      await this.groupsService[serviceName](this.groupOutCopy)
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

  closeForm(): void {
    this.childDrawerRef.close();
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }

  clearErrorInfo() {
    this.mandatoryErrorInfo = null;
  }

  onUploadChange(e: any) {
    this.groupOutCopy.thumbnail = "";
    if (e.type === "success") {
      this.groupOutCopy.thumbnail = e.fileDownloadUri;
    }
    if (e.type === "error") {
      let errorMessage = AppConstants.IMAGE_UPLOAD_ERROR;
      if (e.error) {
        let errorDetails = this.helperService.getErrorDetails(e.error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
      }
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
      this.groupOutCopy.thumbnail = "";
    }
    this.submitForm();
  }

  frameUserIds() {
    this.groupOutCopy.userIds = [];
    for (let i in this.groupOutCopy.userVOs) {
      let users = this.groupOutCopy.userVOs[i];
      this.groupOutCopy.userIds.push(...this.getIds(users));
    }
  }

  getIds(users: any) {
    let ids = users.map((item: any) => {
      return item.id;
    });
    return ids;
  }

  roleChangeHandler(role: any) {
    this.users = [];
    this.getUsersByRole(role.id);
    //this.getUsersByPrivilege(role.rolePrivilegeId);
  }

  userChangeHandler(event: any) {
    this.groupOutCopy.userVOs[this.role.roleName] = this.updateUserInfoArr();
    this.updateUserDetails(this.groupOutCopy.userVOs);
  }

  updateUserInfoArr() {
    let userArr = [];
    if (this.userIds.length > 0) {
      for (let i = 0; i < this.userIds.length; i++) {
        userArr.push(
          this.helperService.findObjectInArrayByKey(
            this.users,
            "id",
            this.userIds[i]
          )
        );
      }
    }
    return userArr;
  }

  updateUserDetails(userInfo: any) {
    this.userDetails = [];
    for (let i in userInfo) {
      this.userDetails.push({
        key: i,
        value: userInfo[i],
        length: userInfo[i].length,
      });
    }
  }

  setUserIds() {
    if (this.groupOutCopy.userVOs[this.role.roleName]) {
      this.userIds = this.groupOutCopy.userVOs[this.role.roleName].map(
        (item) => {
          return item.id;
        }
      );
    } else {
      this.userIds = null;
    }
  }

  getUserName(user: any) {
    return user.firstName + " " + user.lastName;
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  removeUser(group: any) {
    let userIdToDelete = group.user.id;
    let roleName = group.role.key;
    let currUserArr = this.groupOutCopy.userVOs[roleName];
    let newUserArr = currUserArr.filter((user) => user.id !== userIdToDelete);
    this.groupOutCopy.userVOs[roleName] = newUserArr;
    this.updateUserDetails(this.groupOutCopy.userVOs);
    if (this.role) {
      if (this.role.roleName === roleName) {
        this.userIds = this.userIds.filter((id) => id !== userIdToDelete);
      }
    }
  }

  async getRoleList() {
    await this.rolesService
      .getRoles()
      .toPromise()
      .then((resp: any) => {
        this.roles = resp.entity;
      })
      .catch((error: any) => {
        this.roles = [];
      });
  }

  async getUsersByPrivilege(privilegeId: any) {
    await this.rolesService
      .getUsersByPrivilege(privilegeId)
      .toPromise()
      .then((resp: any) => {
        this.users = resp.entity;
        this.setUserIds();
      })
      .catch((error: any) => {
        this.users = [];
      });
  }

  async getUsersByRole(roleId: any) {
    await this.rolesService
      .getUsersByRole(roleId)
      .toPromise()
      .then((resp: any) => {
        this.users = resp.entity;
        this.setUserIds();
      })
      .catch((error: any) => {
        this.users = [];
      });
  }
}
