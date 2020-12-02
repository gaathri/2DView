import { Component, OnInit, Input } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ClientService } from "../../configs/client.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-client-form",
  templateUrl: "./client-form.component.html",
  styleUrls: ["./client-form.component.scss"],
})
export class ClientFormComponent implements OnInit {
  @Input() clientOut: any;
  @Input() clientOutCopy: any;
  @Input() mode: any;

  isDataReady: boolean;
  departments: any;
  nameMaxLength = AppConstants.MAX_LENGTH_NAME;
  descMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName: string = "";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private clientService: ClientService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.clientOut) {
      this.clientOut = {
        clientName: null,
        clientDesc: null,
      };
    }
    this.clientOutCopy = JSON.parse(JSON.stringify(this.clientOut));
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      clientName: [
        this.clientOutCopy.clientName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      clientDesc: [this.clientOutCopy.clientDesc],
      emailId: [
        this.clientOutCopy.emailId,
        [Validators.email, Validators.required],
      ],
    });
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  close(isSuccess: any): void {
    this.drawerRef.close(isSuccess);
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  async submitHandler() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    if (!this.dataForm.valid) {
      return;
    }
    let successMessage = AppConstants.CLIENT_CREATION_SUCCESS;
    let errorMessage = AppConstants.CLIENT_CREATION_ERROR;
    let serviceName = "createClient";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.mode === "update") {
      postObj.id = this.clientOutCopy.id;
      successMessage = AppConstants.CLIENT_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.CLIENT_MODIFICATION_ERROR;
      serviceName = "updateClient";
    }
    await this.clientService[serviceName](postObj)
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
