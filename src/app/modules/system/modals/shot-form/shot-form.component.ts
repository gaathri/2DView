import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  NzDrawerRef,
  NzDrawerService,
  UploadChangeParam,
  NzModalService,
} from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { ShotAllFieldsComponent } from "../shot-all-fields/shot-all-fields.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SequencesService } from "../../shows/sequences.service";
import { SpotsService } from "../../shows/spots.service";
import { ManualInsertionComponent } from "../manual-insertion/manual-insertion.component";
import { ImportCsvComponent } from "../import-csv/import-csv.component";
import { CustomFieldComponent } from "../custom-field/custom-field.component";
import { CustomFieldService } from "../../configs/custom-field.service";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";

@Component({
  selector: "app-shot-form",
  templateUrl: "./shot-form.component.html",
  styleUrls: ["./shot-form.component.scss"],
})
export class ShotFormComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  @ViewChild("linkDrawerHeader", { static: false })
  linkDrawerHeader: TemplateRef<{}>;
  @Input() shotOut: any;
  @Input() shotOutCopy: any;
  @Input() mode: any;
  @Input() disableShowSelect: boolean;
  @Input() showName: any;

  shows: any;
  sequences: any;
  spots: any;
  isDataReady: boolean;
  title: string;
  childDrawerRef: any;
  shotCodeMaxLength = AppConstants.SHOT_MAX_LENGTH_NAME;
  shotDescMaxLength = AppConstants.MAX_LENGTH_DESC;
  btnName = "";
  linkInfo: any;
  mainForm: FormGroup;
  subFormData: any;
  shotCategory = "sequence";
  customFieldsFormData: any;
  isCustomFieldsValid: boolean;
  customFields: any;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private drawerService: NzDrawerService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private sequencesService: SequencesService,
    private spotsService: SpotsService,
    private customFieldService: CustomFieldService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  isReadOnly() {
    if (this.mode == "update") {
      if (
        this.shotOut &&
        this.shotOut.statusId != 5 &&
        this.shotOut.statusId != 1
      ) {
        return true;
      }
    }
    return false;
    return this.mode == "update";
  }

  getLinks() {
    return this.linkInfo.filter((item: any) => item.isVisible === true);
  }

  async prepareData() {
    this.linkInfo = [
      {
        id: 3,
        title: "View All Fields",
        type: "fields",
        modaltitle: "All Fields",
        isVisible: true,
        isValid: true,
        isMandatoryFieldPresent: false,
      },
      {
        id: 4,
        title: "Manual Ingestion",
        type: "manual_insertion",
        modaltitle: "Manual Ingestion",
        isVisible: this.mode == "update" ? false : true,
        isValid: true,
        isMandatoryFieldPresent: false,
      },
      {
        id: 5,
        title: "Import CSV",
        type: "import_csv",
        modaltitle: "Import CSV",
        isVisible: this.mode == "update" ? false : true,
        isValid: true,
        isMandatoryFieldPresent: false,
      },
      /*{
        id: 6,
        title: "Custom Fields",
        type: "custom_fields",
        modaltitle: "Custom Fields",
        isVisible: true,
      },*/
    ];
    if (!this.disableShowSelect) {
      await this.getShowList();
    }
    if (!this.shotOut) {
      this.shotOut = {
        showId: null,
        shotCategory: "sequence",
        shotCode: "",
        thumbnail: "",
        description: "",
      };
    }
    this.shotOutCopy = JSON.parse(JSON.stringify(this.shotOut));
    if (this.shotOut && this.shotOut.showId) {
      await this.getSequenceList();
      await this.getSpotList();
      await this.getCustomfieldsByEntityId(this.shotOut.showId);
      this.shotOutCopy.shotCategory = "sequence";
      if (this.shotOut.spotId) {
        this.shotOutCopy.shotCategory = "spot";
        //this.shotOutCopy.shotCategory = "sequence";
      } else {
        //this.shotOutCopy.shotCategory = "spot";
      }
    }
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.mainForm = this.fb.group({
      showId: [this.shotOutCopy.showId, [Validators.required]],
      shotCategory: [this.shotOutCopy.shotCategory],
      sequenceId: [this.shotOutCopy.sequenceId, [Validators.required]],
      spotId: [this.shotOutCopy.spotId],
      shotCode: [
        this.shotOutCopy.shotCode,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      thumbnail: [this.shotOutCopy.thumbnail],
      description: [this.shotOutCopy.description],
      //shotCode: [this.shotOutCopy.shotCode, [Validators.required]]
    });

    if (this.mode === "update") {
      this.subFormData = {
        info: this.shotOutCopy.info,
        platePath: this.shotOutCopy.platePath,
        cutIn: this.shotOutCopy.cutIn,
        cutOut: this.shotOutCopy.cutOut,
        headIn: this.shotOutCopy.headIn,
        tailOut: this.shotOutCopy.tailOut,
        frameRange: this.shotOutCopy.frameRange,
        handles: this.shotOutCopy.handles,
        framesPerSec: this.shotOutCopy.framesPerSec,
        focalLength: this.shotOutCopy.focalLength,
        workingRange: this.shotOutCopy.workingRange,
        shootingDate: this.shotOutCopy.shootingDate,
        shootingSupervisorId: this.shotOutCopy.cutIn,
        assetIds: this.shotOutCopy.assetIds,
        parentShotIds: this.shotOutCopy.parentShotIds,
        subShotIds: this.shotOutCopy.subShotIds,
        taskTemplateId: this.shotOutCopy.taskTemplateId,
      };
      this.customFieldsFormData = this.shotOutCopy.customFields;
      this.isCustomFieldsValid = this.validateCustomFields();
    }
    this.requiredChange();
  }

  requiredChange(): void {
    this.shotCategory = this.mainForm.controls.shotCategory.value;
    if (this.shotCategory === "sequence") {
      this.mainForm.get("sequenceId")!.setValidators(Validators.required);
      this.mainForm.get("spotId")!.clearValidators();
      this.mainForm.controls.spotId.setValue(null);
    } else {
      this.mainForm.get("sequenceId")!.clearValidators();
      this.mainForm.get("spotId")!.setValidators(Validators.required);
      this.mainForm.controls.sequenceId.setValue(null);
    }
  }

  async getShowList() {
    await this.showsService
      .getShows()
      .toPromise()
      .then((resp: any) => {
        this.shows = resp.entity;
      })
      .catch((error: any) => {
        this.shows = [];
      });
  }

  async getSequenceList() {
    await this.sequencesService
      .getSequenceList(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.sequences = resp.entity;
      })
      .catch((error: any) => {
        this.sequences = [];
      });
  }

  async getSpotList() {
    await this.spotsService
      .getSpotList(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.spots = resp.entity;
      })
      .catch((error: any) => {
        this.spots = [];
      });
  }

  async getCustomfieldsByEntityId(entityId: any) {
    await this.customFieldService
      .getCustomfieldsByEntityId(entityId, "Shot")
      .toPromise()
      .then((resp) => {
        this.customFields = resp.entity;
        this.addCustomFieldsLink();
      })
      .catch((e) => {
        this.customFields = null;
      });
  }

  showChangeHandler() {
    this.shotOutCopy.sequenceId = null;
    this.shotOutCopy.spotId = null;

    this.mainForm.controls.sequenceId.setValue(null);
    this.mainForm.controls.spotId.setValue(null);

    this.sequences = [];
    this.spots = [];
    this.customFields = [];

    this.shotOutCopy.showId = this.mainForm.controls.showId.value;

    this.getSequenceList();
    this.getSpotList();
    this.getCustomfieldsByEntityId(this.shotOutCopy.showId);
  }

  linkClickHandler(link: any) {
    this.title = link.modaltitle;
    link.isValid = true;
    if (this.isFormValid(link.type)) {
      this.openFrom(link.type);
    }
  }

  isFormValid(type: any) {
    //return true;
    let isValid = true;
    let requiredData = ["showId"];
    if (type === "manual_insertion") {
      if (this.shotCategory === "sequence") {
        requiredData.push("sequenceId");
      } else if (this.shotCategory === "spot") {
        requiredData.push("spotId");
      }
    } else if (type === "import_csv") {
      // add anything if required....
    } else if (type === "fields") {
      // add anything if required....
      // if (type === "fields") {
      //   requiredData.push("shotCode");
      // }
    } else if (type === "custom_fields") {
      // add anything if required....
    }
    for (const i in requiredData) {
      if (!this.mainForm.controls[requiredData[i]].valid) {
        isValid = false;
        this.mainForm.controls[requiredData[i]].markAsDirty();
        this.mainForm.controls[requiredData[i]].updateValueAndValidity();
      }
    }
    return isValid;
  }

  getShotData(type: any) {
    let shotData = {
      showId: this.mainForm.controls.showId.value,
    };
    if (type === "manual_insertion") {
      shotData["sequenceId"] = this.mainForm.controls.sequenceId.value;
      shotData["spotId"] = this.mainForm.controls.spotId.value;
    }
    return shotData;
  }

  onChange($event: any): void {}

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
        isVisible: true,
        isMandatoryFieldPresent: isMandatoryFieldPresent,
      };

      let customFieldsLinkInfo = this.helperService.findObjectInArrayByKey(
        this.linkInfo,
        "type",
        "custom_fields"
      );
      if (customFieldsLinkInfo) {
        customFieldsLinkInfo = customFieldLink;
      } else {
        this.linkInfo.push(customFieldLink);
      }
    }
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  submitHandler() {
    if (this.imageUploadComponent.isChanged) {
      this.imageUploadComponent.handleUpload();
    } else {
      this.submitForm();
    }
  }

  async submitForm() {
    let isValidCustomFieldsForm = this.validCustomFieldsForm();
    for (const i in this.mainForm.controls) {
      this.mainForm.controls[i].markAsDirty();
      this.mainForm.controls[i].updateValueAndValidity();
    }

    if (!this.mainForm.valid) {
      return;
    }
    if (!isValidCustomFieldsForm) {
      return;
    }
    let successMessage = AppConstants.SHOT_CREATION_SUCCESS;
    let errorMessage = AppConstants.SHOT_CREATION_ERROR;
    let serviceName = "createShot";
    let isSuccess = false;
    this.consolidateData();

    let postObj = JSON.parse(JSON.stringify(this.shotOutCopy));
    if (postObj.shootingDate) {
      postObj.shootingDate = this.helperService.transformDate(
        new Date(postObj.shootingDate),
        "yyyy-MM-dd 00:00:00"
      );
      /*let dateISOStr = new Date(postObj.shootingDate).toISOString();
      if (dateISOStr.indexOf("T") > -1) {
        postObj.shootingDate = dateISOStr.split("T")[0]; // + 'T00:00:00.000Z';
      }*/
    }
    if (this.mode === "update") {
      postObj.id = this.shotOut.id;
      successMessage = AppConstants.SHOT_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.SHOT_MODIFICATION_ERROR;
      serviceName = "updateShot";
    }

    await this.showsService[serviceName](postObj)
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

  openFrom(type: string): void {
    if (type === "fields") {
      this.drawerRef.nzOffsetX = 500;
      this.childDrawerRef = this.drawerService.create<
        ShotAllFieldsComponent,
        {
          mode: string;
          shotOutCopy: any;
          parentDrawerRef: any;
          callback?: any;
          id: any;
        },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: ShotAllFieldsComponent,
        nzContentParams: {
          mode: this.mode,
          shotOutCopy: this.shotOutCopy,
          parentDrawerRef: this.drawerRef,
          callback: this.setData.bind(this),
          id: this.shotOut.id,
        },
        nzClosable: false,
        //nzMaskClosable: false,
        //nzKeyboard: false,
        nzWidth: "500px",
        nzWrapClassName: "modal-wrapper no-footer",
        nzOnCancel: () =>
          new Promise((resolve, reject) => {
            this.drawerRef.nzOffsetX = 0;
            resolve(true);
            return;
          }),
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {
        this.drawerRef.nzOffsetX = 0;
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
          parentOutCopy: this.shotOutCopy,
          callback: this.setCustomFieldsFormData.bind(this),
          customFields: this.customFields,
        },
        nzClosable: false,
        //nzMaskClosable: false,
        //nzKeyboard: false,
        nzWidth: "500px",
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
        this.drawerRef.nzOffsetX = 0;
      });
    } else if (type === "manual_insertion") {
      this.drawerRef.nzOffsetX = 500;
      this.childDrawerRef = this.drawerService.create<
        ManualInsertionComponent,
        {
          mode: string;
          shotOutCopy: any;
          parentDrawerRef: any;
        },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: ManualInsertionComponent,
        nzContentParams: {
          mode: this.mode,
          shotOutCopy: this.getShotData(type),
          parentDrawerRef: this.drawerRef,
        },
        nzClosable: false,
        //nzMaskClosable: false,
        //nzKeyboard: false,
        nzWidth: "500px",
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
        this.drawerRef.nzOffsetX = 0;
      });
    } else if (type === "import_csv") {
      this.childDrawerRef = this.drawerService.create<
        ImportCsvComponent,
        {
          mode: string;
          shotOutCopy: any;
          parentDrawerRef: any;
        },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: ImportCsvComponent,
        nzContentParams: {
          mode: this.mode,
          shotOutCopy: this.getShotData(type),
          parentDrawerRef: this.drawerRef,
        },
        nzClosable: false,
        //nzMaskClosable: false,
        //nzKeyboard: false,
        nzWidth: "500px",
        nzWrapClassName: "modal-wrapper",
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {});
    }
  }

  closeForm(): void {
    this.drawerRef.nzOffsetX = 0;
    this.childDrawerRef.close();
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }

  onUploadChange(e: any) {
    this.shotOutCopy.thumbnail = "";
    if (e.type === "success") {
      this.shotOutCopy.thumbnail = e.fileDownloadUri;
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
    this.mainForm.controls.thumbnail.setValue(this.shotOutCopy.thumbnail);
    this.submitForm();
  }

  setCustomFieldsFormData(data: any, isValid: boolean) {
    this.customFieldsFormData = data;
    this.isCustomFieldsValid = isValid;
    this.consolidateData();
  }

  consolidateData() {
    let postObj = JSON.parse(JSON.stringify(this.mainForm.value));
    if (this.subFormData) {
      postObj = { ...postObj, ...this.subFormData };
    }
    if (this.customFieldsFormData) {
      postObj.customFields = this.customFieldsFormData;
    }
    this.shotOutCopy = JSON.parse(JSON.stringify(postObj));
  }

  setData(subFormData) {
    this.subFormData = subFormData;
    this.consolidateData();
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

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
