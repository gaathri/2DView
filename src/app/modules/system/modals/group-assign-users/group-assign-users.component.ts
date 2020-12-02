import { Component, OnInit, Input } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { RolesService } from "../../configs/roles.service";

@Component({
  selector: "app-group-assign-users",
  templateUrl: "./group-assign-users.component.html",
  styleUrls: ["./group-assign-users.component.scss"],
})
export class GroupAssignUsersComponent implements OnInit {
  @Input() groupOutCopy: any;
  isDataReady: boolean;
  role: any;
  users: any;
  roles: any;
  userIds: any;
  userDetails: any;

  constructor(
    private rolesService: RolesService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.prepareData();
    this.updateUserDetails(this.groupOutCopy.userVOs);
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  roleChangeHandler(role: any) {
    this.users = [];
    this.getUsersByPrivilege(role.rolePrivilegeId);
  }

  userChangeHandler(event: any) {
    /*if (!this.groupOutCopy.userVOs) {
      this.groupOutCopy.userVOs = {};
    }
    this.groupOutCopy.userVOs[this.role.roleName] = [...event];*/
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

  async prepareData() {
    await this.getRoleList();
    this.isDataReady = true;
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
}
