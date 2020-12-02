import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { NzDrawerRef, UploadChangeParam, NzDrawerService } from "ng-zorro-antd";
import { AssetsService } from "../../shows/assets.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SequencesService } from "../../shows/sequences.service";
import { SpotsService } from "../../shows/spots.service";
import { CustomFieldService } from "../../configs/custom-field.service";
import { CustomFieldComponent } from "../custom-field/custom-field.component";
import { ShotsService } from "../../shows/shots.service";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";

@Component({
  selector: "app-asset-form",
  templateUrl: "./asset-form.component.html",
  styleUrls: ["./asset-form.component.scss"],
})
export class AssetFormComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  @ViewChild("linkDrawerHeader", { static: false })
  linkDrawerHeader: TemplateRef<{}>;
  @Input() assetOut: any;
  @Input() assetOutCopy: any;
  @Input() mode: any;
  @Input() disableShowSelect: boolean;
  @Input() showName: any;

  shows: any;
  isDataReady: boolean;
  title: string;
  assetNameMaxLength = AppConstants.MAX_LENGTH_NAME;
  assetDescMaxLength = AppConstants.MAX_LENGTH_DESC;
  taskTemplates: any;
  assetTypes: any;
  sequences: any;
  spots: any;
  btnName: string = "";
  dataForm: FormGroup;
  assetCategory = "sequence";
  parentAssets: any;
  subAssets: any;
  shots: any;
  linkInfo = [];
  childDrawerRef: any;
  customFieldsFormData: any;
  isCustomFieldsValid: boolean;
  customFields: any;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private assetsService: AssetsService,
    private sequencesService: SequencesService,
    private spotsService: SpotsService,
    private customFieldService: CustomFieldService,
    private fb: FormBuilder,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  isReadOnly() {
    if (this.mode == "update") {
      if (
        this.assetOut &&
        this.assetOut.statusId != 5 &&
        this.assetOut.statusId != 1
      ) {
        return true;
      }
    }
    return false;
    //return this.mode == "update";
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async prepareData() {
    if (!this.disableShowSelect) {
      await this.getShowList();
    }
    await this.getTaskTemplates();
    await this.getAssetTypes();

    if (!this.assetOut) {
      this.assetOut = {
        showId: null,
        assetCategory: "sequence",
        assetName: "",
        description: "",
        thumbnail: "",
        creativeBrief: "",
        taskTemplateId: null,
        assetTypeId: null,
      };
    }
    this.assetOutCopy = JSON.parse(JSON.stringify(this.assetOut));
    if (this.assetOut && this.assetOut.showId) {
      await this.getSequenceList();
      await this.getSpotList();
      await this.getShotList();
      await this.getParentAssetList();
      await this.getSubAssetList();
      await this.getCustomfieldsByEntityId(this.assetOutCopy.showId);
    }
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    if (this.assetOut) {
      this.assetCategory = "sequence";
      this.assetOutCopy.assetCategory = "sequence";
      if (this.assetOutCopy.spotId) {
        this.assetCategory = "spot";
        this.assetOutCopy.assetCategory = "spot";
      }
    }
    this.dataForm = this.fb.group({
      showId: [this.assetOutCopy.showId, [Validators.required]],
      assetCategory: [this.assetOutCopy.assetCategory],
      sequenceId: [this.assetOutCopy.sequenceId],
      spotId: [this.assetOutCopy.spotId],
      assetName: [
        this.assetOutCopy.assetName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.assetOutCopy.description, [Validators.required]],
      thumbnail: [this.assetOutCopy.thumbnail],
      creativeBrief: [this.assetOutCopy.creativeBrief],
      taskTemplateId: [this.assetOutCopy.taskTemplateId],
      assetTypeId: [this.assetOutCopy.assetTypeId, [Validators.required]],
      shotIds: [this.assetOutCopy.shotIds],
      parentAssetIds: [
        this.assetOutCopy.parentAssetIds && this.assetOutCopy.parentAssetIds[0]
          ? this.assetOutCopy.parentAssetIds[0]
          : null,
      ],
      subAssetIds: [
        this.assetOutCopy.subAssetIds && this.assetOutCopy.subAssetIds[0]
          ? this.assetOutCopy.subAssetIds[0]
          : null,
      ],
      referencePath: [this.assetOutCopy.referencePath],
    });
    if (this.mode === "update") {
      this.customFieldsFormData = this.assetOutCopy.customFields;
      this.isCustomFieldsValid = this.validateCustomFields();
      //this.isCustomFieldsValid = true;
    }
    this.requiredChange();
  }

  requiredChange(): void {
    /*this.assetCategory = this.dataForm.controls.assetCategory.value;
    if (this.assetCategory === "sequence") {
      this.dataForm.get("sequenceId")!.setValidators(Validators.required);
      this.dataForm.get("spotId")!.clearValidators();
      this.dataForm.controls.spotId.setValue(null);
    } else {
      this.dataForm.get("sequenceId")!.clearValidators();
      this.dataForm.get("spotId")!.setValidators(Validators.required);
      this.dataForm.controls.sequenceId.setValue(null);
    }*/
  }

  showChangeHandler() {
    this.assetOutCopy.sequenceId = null;
    this.assetOutCopy.spotId = null;
    this.assetOutCopy.shotIds = null;
    this.assetOutCopy.parentAssetIds = null;
    this.assetOutCopy.subAssetIds = null;

    this.dataForm.controls.sequenceId.setValue(null);
    this.dataForm.controls.spotId.setValue(null);
    this.dataForm.controls.shotIds.setValue(null);
    this.dataForm.controls.parentAssetIds.setValue(null);
    this.dataForm.controls.subAssetIds.setValue(null);

    this.sequences = [];
    this.spots = [];
    this.shots = [];
    this.parentAssets = [];
    this.subAssets = [];
    this.customFields = [];

    this.assetOutCopy.showId = this.dataForm.controls.showId.value;

    this.getSequenceList();
    this.getSpotList();
    this.getShotList();
    this.getParentAssetList();
    this.getSubAssetList();
    this.getCustomfieldsByEntityId(this.assetOutCopy.showId);
  }

  getParentAssets() {
    let parentAssets = this.parentAssets;
    let subAssetIds = null;
    if (
      this.dataForm &&
      this.dataForm.value &&
      this.dataForm.value.subAssetIds
    ) {
      subAssetIds = this.dataForm.value.subAssetIds;

      let c = this.helperService.filterSelfId(parentAssets, subAssetIds);

      // let c = this.parentAssets.filter(
      //   (o) => !subAssetIds.find((id) => o.id === id)
      // );
      return c;
    }

    return parentAssets;
  }

  getSubAssets() {
    let subAssets = this.subAssets;
    let parentAssetIds = null;
    if (
      this.dataForm &&
      this.dataForm.value &&
      this.dataForm.value.parentAssetIds
    ) {
      parentAssetIds = this.dataForm.value.parentAssetIds;

      let c = this.helperService.filterSelfId(subAssets, parentAssetIds);

      // let c = this.subAssets.filter(
      //   (o) => !parentAssetIds.find((id) => o.id === id)
      // );
      return c;
    }

    return subAssets;
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

  async getTaskTemplates() {
    await this.showsService
      .getTaskTemplates()
      .toPromise()
      .then((resp: any) => {
        this.taskTemplates = resp.entity;
      })
      .catch((error: any) => {
        this.taskTemplates = [];
      });
  }

  async getSequenceList() {
    return;
    await this.sequencesService
      .getSequenceList(this.assetOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.sequences = resp.entity;
      })
      .catch((error: any) => {
        this.sequences = [];
      });
  }

  async getSpotList() {
    return;
    await this.spotsService
      .getSpotList(this.assetOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.spots = resp.entity;
      })
      .catch((error: any) => {
        this.spots = [];
      });
  }

  async getAssetTypes() {
    await this.assetsService
      .getAssetTypes()
      .toPromise()
      .then((resp: any) => {
        this.assetTypes = resp.entity;
      })
      .catch((error: any) => {
        this.assetTypes = [];
      });
  }

  async getShotList() {
    await this.shotsService
      .getLinkedShotList(this.assetOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.shots = resp.entity;
      })
      .catch((error: any) => {
        this.shots = [];
      });
  }

  async getParentAssetList() {
    await this.assetsService
      .getParentAssetList(this.assetOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.parentAssets = resp.entity;
        if (this.assetOut.id) {
          this.parentAssets = this.helperService.filterSelfId(
            resp.entity,
            this.assetOut.id
          );
        }
      })
      .catch((error: any) => {
        this.parentAssets = [];
      });
  }

  async getSubAssetList() {
    await this.assetsService
      .getSubAssetList(this.assetOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.subAssets = resp.entity;
        if (this.assetOut.id) {
          this.subAssets = this.helperService.filterSelfId(
            resp.entity,
            this.assetOut.id
          );
        }
      })
      .catch((error: any) => {
        this.subAssets = [];
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

  linkClickHandler(link: any) {
    this.title = link.modaltitle;
    link.isValid = true;
    this.openFrom(link.type);
  }

  openFrom(type: string): void {
    if (type === "custom_fields") {
      //this.drawerRef.nzOffsetX = 400;
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
          parentOutCopy: this.assetOutCopy,
          callback: this.setCustomFieldsFormData.bind(this),
          customFields: this.customFields,
        },
        nzClosable: false,
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
        this.clearErrorInfo();
      });
    }
  }

  setCustomFieldsFormData(data: any, isValid: boolean) {
    this.customFieldsFormData = data;
    this.isCustomFieldsValid = isValid;
    this.consolidateData();
  }

  consolidateData() {
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.customFieldsFormData) {
      postObj.customFields = this.customFieldsFormData;
    }
    this.assetOutCopy = JSON.parse(JSON.stringify(postObj));
  }

  closeForm(): void {
    this.drawerRef.nzOffsetX = 0;
    this.childDrawerRef.close();
  }

  clearErrorInfo() {
    //this.mandatoryErrorInfo = null;
  }

  validCustomFieldsForm() {
    if (this.linkInfo && this.linkInfo.length > 0) {
      let isValid =
        this.customFieldsFormData && this.isCustomFieldsValid ? true : false;
      if (!isValid) {
        isValid = this.validateCustomFields();
      }
      this.linkInfo[0].isValid = isValid;
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
      this.linkInfo.push(customFieldLink);
      this.linkInfo[0] = customFieldLink;
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
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }

    if (!this.dataForm.valid) {
      return;
    }

    if (!isValidCustomFieldsForm) {
      return;
    }
    this.consolidateData();

    let successMessage = AppConstants.ASSET_CREATION_SUCCESS;
    let errorMessage = AppConstants.ASSET_CREATION_ERROR;
    let serviceName = "createAsset";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.assetOutCopy));
    delete postObj.assetCategory;
    if (postObj.subAssetIds) {
      postObj.subAssetIds = [postObj.subAssetIds];
    } else {
      postObj.subAssetIds = [];
    }

    if (postObj.parentAssetIds) {
      postObj.parentAssetIds = [postObj.parentAssetIds];
    } else {
      postObj.parentAssetIds = [];
    }
    if (this.mode === "update") {
      postObj.id = this.assetOut.id;
      successMessage = AppConstants.ASSET_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.ASSET_MODIFICATION_ERROR;
      serviceName = "updateAsset";
    }
    await this.assetsService[serviceName](postObj)
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

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
  }

  onUploadChange(e: any) {
    this.assetOutCopy.thumbnail = "";
    if (e.type === "success") {
      this.assetOutCopy.thumbnail = e.fileDownloadUri;
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
    this.dataForm.controls.thumbnail.setValue(this.assetOutCopy.thumbnail);
    this.submitForm();
  }

  validateCustomFields2() {
    /*let customFields = null;
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
    return customFieldForm.valid;*/
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
