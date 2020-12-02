import { Component, OnInit, Input } from "@angular/core";
import { ShowsService } from "../../shows/shows.service";
import { GroupsService } from "../../configs/groups.service";
import { NzDrawerRef } from "ng-zorro-antd";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-assign-users",
  templateUrl: "./assign-users.component.html",
  styleUrls: ["./assign-users.component.scss"],
})
export class AssignUsersComponent implements OnInit {
  @Input() showOutCopy: any;
  @Input() mode: any;
  @Input() callback: any;

  isDataReady: boolean;
  groups: any;
  users: any;
  supervisors: any;
  producers: any;

  mainForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private showsService: ShowsService,
    private groupsService: GroupsService,
    private helperService: HelperService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.prepareData();
    this.drawerRef.afterClose.subscribe((data) => {
      this.callback(this.mainForm.value, this.mainForm.valid);
    });
  }

  async prepareData() {
    await this.getGroupList();
    await this.getUserList();
    await this.getSupervisorList();
    await this.getProducerList();
    this.buildFormData();
    this.isDataReady = true;
  }

  isRequired(control: any) {
    if (
      this.mainForm.controls[control] &&
      this.mainForm.controls[control].validator
    ) {
      let validators = this.mainForm.controls[control].validator(control);
      if (validators && validators.hasOwnProperty("required")) {
        return true;
      }
    }
    return false;
  }

  buildFormData() {
    this.mainForm = this.fb.group({
      userGroupIds: [this.showOutCopy.userGroupIds, [Validators.required]],
      userIds: [this.showOutCopy.userIds, [Validators.required]],
      inchargeIds: [this.showOutCopy.inchargeIds, [Validators.required]],
      producerIds: [this.showOutCopy.producerIds, [Validators.required]],
    });
    if (this.mode === "update") {
      this.requiredChange();
    }
  }

  async getGroupList() {
    await this.groupsService
      .getGroupList()
      .toPromise()
      .then((resp: any) => {
        this.groups = resp.entity;
      })
      .catch((error: any) => {
        this.groups = [];
      });
  }

  async getUserList() {
    await this.showsService
      .getUserList()
      .toPromise()
      .then((resp: any) => {
        this.users = resp.entity;
      })
      .catch((error: any) => {
        this.users = [];
      });
  }

  async getSupervisorList() {
    await this.showsService
      .getSupervisorList()
      .toPromise()
      .then((resp: any) => {
        this.supervisors = resp.entity;
      })
      .catch((error: any) => {
        this.supervisors = [];
      });
  }

  async getProducerList() {
    await this.showsService
      .getProducerList()
      .toPromise()
      .then((resp: any) => {
        this.producers = resp.entity;
      })
      .catch((error: any) => {
        this.producers = [];
      });
  }

  onChange($event: string[]): void {}

  onUserGroupChange(event: any) {
    this.requiredChange();
    // let userGroupIds = this.mainForm.controls.userGroupIds.value;
    // if (userGroupIds) {
    //   this.mainForm.get("userIds")!.clearValidators();
    // }
  }

  onUserChange(event: any) {
    this.requiredChange();
    // let userIds = this.mainForm.controls.userIds.value;
    // if (userIds) {
    //   this.mainForm.get("userGroupIds")!.clearValidators();
    // }
  }

  submitHandler() {
    for (const i in this.mainForm.controls) {
      this.mainForm.controls[i].markAsDirty();
      this.mainForm.controls[i].updateValueAndValidity();
    }
    if (!this.mainForm.valid) {
      return;
    }
  }

  isSelected(user: any) {
    if (this.mode === "update") {
      let userIds = this.mainForm.controls.userIds.value;
      if (userIds) {
        return userIds.indexOf(user.id) !== -1;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  requiredChange(): void {
    let userGroupIds = this.mainForm.controls.userGroupIds.value;
    let userIds = this.mainForm.controls.userIds.value;

    if (
      !this.helperService.isValidArr(userGroupIds) &&
      !this.helperService.isValidArr(userIds)
    ) {
      this.mainForm.get("userGroupIds")!.setValidators(Validators.required);
      this.mainForm.get("userIds")!.setValidators(Validators.required);
      this.mainForm.get("userGroupIds")!.markAsDirty();
      this.mainForm.get("userIds")!.markAsDirty();
    } else {
      this.mainForm.get("userIds")!.clearValidators();
      this.mainForm.get("userIds")!.markAsPristine();
      this.mainForm.get("userGroupIds")!.clearValidators();
      this.mainForm.get("userGroupIds")!.markAsPristine();
    }

    /*else if (this.helperService.isValidArr(userGroupIds)) {
      this.mainForm.get("userIds")!.clearValidators();
      this.mainForm.get("userIds")!.markAsPristine();
    } else if (this.helperService.isValidArr(userIds)) {
      this.mainForm.get("userGroupIds")!.clearValidators();
      this.mainForm.get("userGroupIds")!.markAsPristine();
    }*/
    this.mainForm.get("userGroupIds")!.updateValueAndValidity();
    this.mainForm.get("userIds")!.updateValueAndValidity();

    /*if (this.taskCategory === "shot") {
      this.dataForm.get("shotId")!.setValidators(Validators.required);
      this.dataForm.get("assetId")!.clearValidators();
      this.dataForm.controls.assetId.setValue(null);
    } else {
      this.dataForm.get("shotId")!.clearValidators();
      this.dataForm.get("assetId")!.setValidators(Validators.required);
      this.dataForm.controls.shotId.setValue(null);
    }*/
  }
}
