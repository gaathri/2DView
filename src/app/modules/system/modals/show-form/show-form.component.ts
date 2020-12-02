import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NzDrawerRef, NzDrawerService, UploadChangeParam } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AssignUsersComponent } from "../assign-users/assign-users.component";
import { SelectTemplatesComponent } from "../select-templates/select-templates.component";
import { AllFieldsComponent } from "../all-fields/all-fields.component";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomFieldService } from "../../configs/custom-field.service";
import { CustomFieldComponent } from "../custom-field/custom-field.component";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";

@Component({
  selector: "app-show-form",
  templateUrl: "./show-form.component.html",
  styleUrls: ["./show-form.component.scss"],
})
export class ShowFormComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  @ViewChild("linkDrawerHeader", { static: false })
  linkDrawerHeader: TemplateRef<{}>;
  @Input() showOut: any;
  @Input() showOutCopy: any;
  @Input() mode: any;
  isDataReady: boolean;
  title: string;
  childDrawerRef: any;
  showNameMaxLength = AppConstants.MAX_LENGTH_NAME;
  showDescMaxLength = AppConstants.MAX_LENGTH_DESC;
  linkInfo = [
    {
      id: 1,
      title: "Assign Users",
      type: "users",
      modaltitle: "Assign Users",
      isValid: true,
      isMandatoryFieldPresent: true,
    },
    {
      id: 2,
      title: "Select Templates",
      type: "templates",
      modaltitle: "Select Templates",
      isValid: true,
      isMandatoryFieldPresent: true,
    },
    {
      id: 3,
      title: "View All Fields",
      type: "fields",
      modaltitle: "All Fields",
      isValid: true,
      isMandatoryFieldPresent: true,
    },
  ];
  mandatoryErrorInfo: any;
  btnName = "";
  mainForm: FormGroup;
  usersFormData: any;
  isUsersValid: boolean;
  templatesFormData: any;
  isTemplatesValid: boolean;
  allFieldsFormData: any;
  isAllFieldsValid: boolean;
  customFieldsFormData: any;
  isCustomFieldsValid: boolean;
  isAlertVisible: boolean;
  customFields: any;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private drawerService: NzDrawerService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private customFieldService: CustomFieldService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
    if (!this.showOut) {
      this.showOut = {
        showName: "",
        description: "",
        thumbnail: "",
        packTemplateIds: [],
        userGroupIds: [],
        userIds: [],
        inchargeIds: [],
        producerIds: [],
        shotAttributes: [],
        sourceFileLoc: "",
        server: "",
      };
    }

    if (this.mode === "update") {
      await this.getCustomfieldsByEntityId(this.showOut.id);
    } else {
      await this.getCustomfieldsByEntityId("global");
    }

    this.showOutCopy = JSON.parse(JSON.stringify(this.showOut));

    this.buildFormData();
    this.isDataReady = true;
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  buildFormData() {
    this.mainForm = this.fb.group({
      showName: [
        this.showOutCopy.showName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      thumbnail: [this.showOutCopy.thumbnail],
      description: [this.showOutCopy.description],
    });
    //--for update show--//

    if (this.mode === "update") {
      this.usersFormData = {
        userGroupIds: this.showOutCopy.userGroupIds,
        userIds: this.showOutCopy.userIds,
        inchargeIds: this.showOutCopy.inchargeIds,
        producerIds: this.showOutCopy.producerIds,
      };

      this.isUsersValid = false;
      if (
        this.isValidArr(this.showOutCopy.userGroupIds) ||
        this.isValidArr(this.showOutCopy.userIds)
      ) {
        if (
          this.isValidArr(this.showOutCopy.inchargeIds) &&
          this.isValidArr(this.showOutCopy.producerIds)
        ) {
          this.isUsersValid = true;
        }
      }

      this.templatesFormData = {
        showTemplateId: this.showOutCopy.showTemplateId,
        shotTemplateId: this.showOutCopy.shotTemplateId,
        packTemplateIds: this.showOutCopy.packTemplateIds,
      };
      this.isTemplatesValid = true;

      this.isAllFieldsValid = false;
      this.allFieldsFormData = {
        clientId: this.showOutCopy.clientId,
        shotAttributes: this.showOutCopy.shotAttributes,
        sourceFileLoc: this.showOutCopy.sourceFileLoc,
        server: this.showOutCopy.server,
      };
      if (
        this.helperService.isValidArr(this.showOutCopy.shotAttributes) &&
        this.showOutCopy.clientId &&
        this.showOutCopy.sourceFileLoc &&
        this.showOutCopy.server
      ) {
        this.isAllFieldsValid = true;
      }

      this.customFieldsFormData = this.showOutCopy.customFields;

      this.isCustomFieldsValid = this.validateCustomFields();

      //this.isUsersValid = true;
      //this.isCustomFieldsValid = true;
    }
    //--for update show--//
  }

  linkClickHandler(link: any) {
    this.title = link.modaltitle;
    link.isValid = true;
    this.openFrom(link.type);
  }

  onChange($event: any): void {
    this.clearErrorInfo();
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  setUsersFormData(data: any, isValid: boolean) {
    this.usersFormData = data;
    this.isUsersValid = isValid;
    this.consolidateData();
  }

  setTemplatesFormData(data: any, isValid: boolean) {
    this.templatesFormData = data;
    this.isTemplatesValid = isValid;
    this.consolidateData();
  }

  setAllFieldsFormData(data: any, isValid: boolean) {
    this.allFieldsFormData = data;
    this.isAllFieldsValid = isValid;
    this.consolidateData();
  }

  setCustomFieldsFormData(data: any, isValid: boolean) {
    this.customFieldsFormData = data;
    this.isCustomFieldsValid = isValid;
    this.consolidateData();
  }

  consolidateData() {
    let postObj = JSON.parse(JSON.stringify(this.mainForm.value));
    if (this.usersFormData) {
      postObj = { ...postObj, ...this.usersFormData };
    }
    if (this.templatesFormData) {
      postObj = { ...postObj, ...this.templatesFormData };
    }
    if (this.allFieldsFormData) {
      postObj = { ...postObj, ...this.allFieldsFormData };
    }
    if (this.customFieldsFormData) {
      //postObj = { ...postObj, ...this.customFieldsFormData };
      postObj.customFields = this.customFieldsFormData;
    }

    this.showOutCopy = JSON.parse(JSON.stringify(postObj));
  }

  validUsersForm() {
    let isValid = this.usersFormData && this.isUsersValid ? true : false;
    this.linkInfo[0].isValid = isValid;
    return isValid;
  }

  validTemplatesForm() {
    let isValid =
      this.templatesFormData && this.isTemplatesValid ? true : false;
    this.linkInfo[1].isValid = isValid;
    return isValid;
  }

  validAllFieldsForm() {
    let isValid =
      this.allFieldsFormData && this.isAllFieldsValid ? true : false;
    this.linkInfo[2].isValid = isValid;
    return isValid;
  }

  validCustomFieldsForm() {
    if (this.linkInfo && this.linkInfo.length > 0 && this.linkInfo[3]) {
      let isValid =
        this.customFieldsFormData && this.isCustomFieldsValid ? true : false;
      if (!isValid) {
        isValid = this.validateCustomFields();
      }
      this.linkInfo[3].isValid = isValid;
      return isValid;
    }
    return true;
  }

  addCustomFieldsLink() {
    let isMandatoryFieldPresent = this.helperService.isMandatoryFieldPresent(
      this.customFields
    );
    if (this.customFields && this.customFields.length > 0) {
      let customFieldLink = {
        id: 1,
        title: "Custom Fields",
        type: "custom_fields",
        modaltitle: "Custom Fields",
        isValid: true,
        isMandatoryFieldPresent: isMandatoryFieldPresent,
      };
      this.linkInfo[3] = customFieldLink;
    }
  }

  async getCustomfieldsByEntityId(entityId: any) {
    await this.customFieldService
      .getCustomfieldsByEntityId(entityId, "Show")
      .toPromise()
      .then((resp) => {
        /*resp = {
          entity: [
            {
              id: 1,
              name: "Favourite Game",
              format: "String",
              description: "Favourite Game",
              isGolbal: 0,
              isMandatory: 0,
              isActive: 1,
            },
            {
              id: 2,
              name: "Best Movie Global",
              format: "String",
              description: "Mention the best movie",
              isGolbal: 0,
              isMandatory: 1,
              isActive: 1,
            },
          ],
          errorProperties: [],
          httpStatus: "OK",
          errMsg: "",
          total: 1,
          valid: true,
        };*/
        this.customFields = resp.entity;
        this.addCustomFieldsLink();
      })
      .catch((e) => {
        this.customFields = null;
      });
  }

  submitHandler() {
    if (this.imageUploadComponent.isChanged) {
      this.imageUploadComponent.handleUpload();
    } else {
      this.submitForm();
    }
  }

  async submitForm() {
    let isValidUsersForm = this.validUsersForm();
    let isValidTemplatesForm = this.validTemplatesForm();
    let isValidAllFieldsForm = this.validAllFieldsForm();
    let isValidCustomFieldsForm = this.validCustomFieldsForm();

    for (const i in this.mainForm.controls) {
      this.mainForm.controls[i].markAsDirty();
      this.mainForm.controls[i].updateValueAndValidity();
    }

    if (!this.mainForm.valid) {
      return;
    }

    if (
      !isValidUsersForm ||
      !isValidTemplatesForm ||
      !isValidAllFieldsForm ||
      !isValidCustomFieldsForm
    ) {
      return;
    }
    this.consolidateData();
    let successMessage = AppConstants.SHOW_CREATION_SUCCESS;
    let errorMessage = AppConstants.SHOW_CREATION_ERROR;
    let serviceName = "createShow";
    let isSuccess = false;
    if (this.mode === "update") {
      this.showOutCopy.id = this.showOut.id;
      successMessage = AppConstants.SHOW_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.SHOW_MODIFICATION_ERROR;
      serviceName = "updateShow";
    }
    await this.showsService[serviceName](this.showOutCopy)
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
        if (error && error.error && error.error.body) {
          if (error.error.body[0] && error.error.body[0].message) {
            errorMessage =
              errorMessage + "<br/>Reason : " + error.error.body[0].message;
          }
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
    this.close(isSuccess);

    /*let isInvalidPattern = this.isPatternError(this.showOutCopy.showName);
    if (isInvalidPattern) {
      this.mandatoryErrorInfo = {
        title: "Show Name : " + AppConstants.PATTERN_ERROR,
        subTitle: "Pattern mismatch"
      };
      return;
    }
    let inputError = this.getInputError();
    if (inputError !== "") {
      this.mandatoryErrorInfo = {
        title: AppConstants.MANDATORY_ERROR,
        subTitle: "Data missing : " + inputError
      };
    } else {
      let successMessage = AppConstants.SHOW_CREATION_SUCCESS;
      let errorMessage = AppConstants.SHOW_CREATION_ERROR;
      let serviceName = "createShow";
      let isSuccess = false;
      if (this.mode === "update") {
        successMessage = AppConstants.SHOW_MODIFICATION_SUCCESS;
        errorMessage = AppConstants.SHOW_MODIFICATION_ERROR;
        serviceName = "updateShow";
      }
      await this.showsService[serviceName](this.showOutCopy)
        .toPromise()
        .then((resp: any) => {
          isSuccess = true;
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION
          });
        })
        .catch((error: any) => {
          if (error && error.error && error.error.body) {
            if (error.error.body[0] && error.error.body[0].message) {
              errorMessage =
                errorMessage + "<br/>Reason : " + error.error.body[0].message;
            }
          }
          this.showNotification({
            type: "error",
            title: "Error",
            content: errorMessage,
            duration: AppConstants.NOTIFICATION_DURATION
          });
        });
      this.close(isSuccess);
    }*/
  }

  castShowOutData(mode: any) {
    let arrKeys = [
      //"userIds",
      "producerIds",
      "inchargeIds",
      "shotAttributes",
      "packTemplateIds",
    ];
    let keys = ["clientId", "showTemplateId", "shotTemplateId"];
    let postData = JSON.parse(JSON.stringify(this.showOutCopy));
    for (let i = 0; i < arrKeys.length; i++) {
      let key = arrKeys[i];
      if (mode === "out") {
        postData[key] = this.helperService.convertArrStrToNum(postData[key]);
      } else {
        postData[key] = this.helperService.convertArrNumToStr(postData[key]);
      }
    }
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (postData[key]) {
        if (mode === "out") {
          postData[key] = Number(postData[key]);
        } else {
          postData[key] = postData[key].toString();
        }
      }
    }
    return postData;
  }

  getInputError() {
    let inputError = "";
    let mandatoryStrings = ["showName", "sourceFileLoc", "server"];
    inputError = this.helperService.getInvalidMandatoryStrings(
      this.showOutCopy,
      mandatoryStrings
    );
    if (inputError === "") {
      let mandatoryNumbers = ["clientId", "showTemplateId", "shotTemplateId"];
      inputError = this.helperService.getInvalidMandatoryNumbers(
        this.showOutCopy,
        mandatoryNumbers
      );
    }
    if (inputError === "") {
      let mandatoryArrays = [
        "packTemplateIds",
        "shotAttributes",
        "inchargeIds",
        "producerIds",
      ];
      inputError = this.helperService.getInvalidMandatoryArrays(
        this.showOutCopy,
        mandatoryArrays
      );
    }
    if (inputError === "") {
      let anyoneMandatoryArrays = ["userGroupIds", "userIds"];
      let isValid = this.helperService.isAnyoneMandatoryArraysFilled(
        this.showOutCopy,
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
      this.drawerRef.nzOffsetX = 500;
      this.childDrawerRef = this.drawerService.create<
        AssignUsersComponent,
        { mode: string; showOutCopy: any; callback: any },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: AssignUsersComponent,
        nzContentParams: {
          mode: this.mode,
          showOutCopy: this.showOutCopy,
          callback: this.setUsersFormData.bind(this),
        },
        nzClosable: false,
        nzWidth: 600,
        nzWrapClassName: "modal-wrapper",
        nzOnCancel: () =>
          new Promise((resolve, reject) => {
            this.drawerRef.nzOffsetX = 0;
            resolve(true);
            return;
          }),
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {
        this.clearErrorInfo();
      });
    } else if (type === "templates") {
      this.drawerRef.nzOffsetX = 500;
      this.childDrawerRef = this.drawerService.create<
        SelectTemplatesComponent,
        { mode: string; showOutCopy: any; callback: any },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: SelectTemplatesComponent,
        nzContentParams: {
          mode: this.mode,
          showOutCopy: this.showOutCopy,
          callback: this.setTemplatesFormData.bind(this),
        },
        nzClosable: false,
        nzWidth: 600,
        nzWrapClassName: "modal-wrapper",
        nzOnCancel: () =>
          new Promise((resolve, reject) => {
            this.drawerRef.nzOffsetX = 0;
            resolve(true);
            return;
          }),
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {
        this.clearErrorInfo();
      });
    } else if (type === "custom_fields") {
      this.drawerRef.nzOffsetX = 500;
      this.childDrawerRef = this.drawerService.create<
        CustomFieldComponent,
        { mode: string; parentOutCopy: any; callback: any; customFields?: any },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: CustomFieldComponent,
        nzContentParams: {
          mode: this.mode,
          parentOutCopy: this.showOutCopy,
          callback: this.setCustomFieldsFormData.bind(this),
          customFields: this.customFields,
        },
        nzClosable: false,
        nzWidth: 600,
        nzWrapClassName: "modal-wrapper",
        nzOnCancel: () =>
          new Promise((resolve, reject) => {
            this.drawerRef.nzOffsetX = 0;
            resolve(true);
            return;
          }),
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {
        this.clearErrorInfo();
      });
    } else if (type === "fields") {
      this.drawerRef.nzOffsetX = 500;
      this.childDrawerRef = this.drawerService.create<
        AllFieldsComponent,
        { mode: string; showOutCopy: any; callback: any },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: AllFieldsComponent,
        nzContentParams: {
          mode: this.mode,
          showOutCopy: this.showOutCopy,
          callback: this.setAllFieldsFormData.bind(this),
        },
        nzClosable: false,
        nzWidth: 600,
        nzWrapClassName: "modal-wrapper",
        nzOnCancel: () =>
          new Promise((resolve, reject) => {
            this.drawerRef.nzOffsetX = 0;
            resolve(true);
            return;
          }),
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {
        this.clearErrorInfo();
      });
    }
  }

  closeForm(): void {
    this.drawerRef.nzOffsetX = 0;
    this.childDrawerRef.close();
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }

  clearErrorInfo() {
    this.mandatoryErrorInfo = null;
  }

  onUploadChange(e: any) {
    this.showOutCopy.thumbnail = "";
    if (e.type === "success") {
      this.showOutCopy.thumbnail = e.fileDownloadUri;
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
    }
    this.mainForm.controls.thumbnail.setValue(this.showOutCopy.thumbnail);
    this.submitForm();
  }

  showAlert() {
    this.isAlertVisible = true;
  }

  onConfirm() {
    this.isAlertVisible = false;
    this.close(false);
  }

  onCancel() {
    this.isAlertVisible = false;
  }

  /*validateCustomFields2() {
    let customFields = null;
    let customFieldsNew = null;
    if (this.isValidArr(this.customFieldsFormData)) {
      customFields = JSON.parse(JSON.stringify(this.customFieldsFormData)); //SHOW level custom field values.
    }
    if (this.isValidArr(this.customFields)) {
      customFieldsNew = JSON.parse(JSON.stringify(this.customFields)); //CONFIG level custom fields. Admin may be added or deleted.
    }
    if (!this.isValidArr(customFieldsNew)) {
      //if there is no config level custom fields.
      //no need to have this check.
      return true;
    }

    if (!this.isValidArr(customFields)) {
      //config level custom fields available, but no vaild data in show level.
      return false;
    }

    //below steps : comparing config and show level custom field values.
    let c = customFieldsNew.filter(
      (o: any) => !customFields.find((o2) => o.id === o2.id)
    );
    if (c && c.length > 0) {
      c = JSON.parse(JSON.stringify(c));
      customFieldsNew = customFields.concat(c);
    } else {
      customFieldsNew = customFields;
    }

    //private fb: FormBuilder
    let customFieldForm: FormGroup = this.fb.group({});
    for (let i = 0; i < customFieldsNew.length; i++) {
      let customField = customFieldsNew[i];
      customFieldForm.addControl(
        customField.name,
        this.fb.control(customField.value)
      );
      if (customField.isMandatory) {
        customFieldForm
          .get(customField.name)!
          .setValidators(Validators.required);
      }
    }
    return customFieldForm.valid;
  }*/

  validateCustomFields() {
    let customFields = null;
    let customFieldsNew = null;
    if (this.isValidArr(this.customFieldsFormData)) {
      customFields = JSON.parse(JSON.stringify(this.customFieldsFormData)); //SHOW level custom field values.
    }
    if (this.isValidArr(this.customFields)) {
      customFieldsNew = JSON.parse(JSON.stringify(this.customFields)); //CONFIG level custom fields. Admin may be added or deleted.
    }
    if (!this.isValidArr(customFieldsNew)) {
      //if there is no config level custom fields.
      //no need to have this check.
      return true;
    }

    // if (!this.isValidArr(customFields)) {
    //config level custom fields available, but no vaild data in show level.
    //return false;
    // }

    if (this.isValidArr(customFields)) {
      //below steps : comparing config and show level custom field values.
      let c = customFieldsNew.filter(
        (o: any) => !customFields.find((o2) => o.id === o2.id)
      );
      if (c && c.length > 0) {
        c = JSON.parse(JSON.stringify(c));
        customFieldsNew = customFields.concat(c);
      } else {
        customFieldsNew = customFields;
      }
    }

    //private fb: FormBuilder
    let customFieldForm: FormGroup = this.fb.group({});
    for (let i = 0; i < customFieldsNew.length; i++) {
      let customField = customFieldsNew[i];
      customFieldForm.addControl(
        customField.name,
        this.fb.control(customField.value)
      );
      if (customField.isMandatory) {
        customFieldForm
          .get(customField.name)!
          .setValidators(Validators.required);
      }
    }
    for (const i in customFieldForm.controls) {
      customFieldForm.controls[i].markAsDirty();
      customFieldForm.controls[i].updateValueAndValidity();
    }
    return customFieldForm.valid;
  }
}
