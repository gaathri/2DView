import { Component, OnInit, ViewChild } from "@angular/core";
import { ImageUploadComponent } from "src/app/modules/shared/components/image-upload/image-upload.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { TemplatesService } from "../templates.service";
import { AdminDashboardService } from "../../dashboards/admin-dashboard.service";

@Component({
  selector: "app-email-template-list",
  templateUrl: "./email-template-list.component.html",
  styleUrls: ["./email-template-list.component.scss"],
})
export class EmailTemplateListComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: false })
  imageUploadComponent: ImageUploadComponent;
  isDataReady: boolean;
  isImageReady: boolean;
  subjectMaxLength = 50;
  labelMaxLength = 20;

  dataForm: FormGroup;
  emailOut: any;
  emailOutCopy: any;

  replyInputValue = "Test Value";
  mailTypes: any;
  selectedMailType: any;
  selectedMailTemplate: any;
  isVisible: boolean;
  appLogo: any;
  studioOut: any;

  customOptions = [
    {
      import: "attributors/style/size",
      whitelist: [
        "10px",
        "12px",
        "16px",
        "18px",
        "20px",
        "24px",
        "28px",
        "32px",
        "46px",
      ],
    },
  ];

  toolbarOptions = {
    toolbar: [
      ["bold", "italic", "underline"],
      ["link"],
      [/*{ list: "ordered" },*/ { list: "bullet" }],
      //[{ indent: "-1" }, { indent: "+1" }],
      //[{ color: [] }, { background: [] }],
      [
        {
          color: [
            "#00C293",
            "#139688",
            "#19c293",
            "#00b15f",
            "#409FFF",
            "#ffd538",
            "#ff643d",
            "#19b4d2",
            "#393e46",
            "#000000",
            "#FFFFFF",
            "#FF0000",
            "#00FF00",
            "#0000FF",
          ],
        },
        {
          background: [
            "#00C293",
            "#139688",
            "#19c293",
            "#00b15f",
            "#409FFF",
            "#ffd538",
            "#ff643d",
            "#19b4d2",
            "#393e46",
            "#000000",
            "#FFFFFF",
            "#FF0000",
            "#00FF00",
            "#0000FF",
          ],
        },
      ],
      [{ align: [] }],
      [
        {
          size: [
            "10px",
            "12px",
            "16px",
            "18px",
            "20px",
            "24px",
            "28px",
            "32px",
            "46px",
          ],
        },
      ],
    ],
  };

  constructor(
    private notificationService: NotificationService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private adminDashboardService: AdminDashboardService,
    private templatesService: TemplatesService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  submitHandler() {}

  async prepareData() {
    await this.getStudio(AppConstants.MY_STUDIO_ID);
    await this.getMailTypes();
    await this.clickHandler(this.mailTypes[0]);
    /*if (!this.emailOut) {
      this.emailOut = {
        subject: null,
        body: null,
        icon: null,
        buttonLabel: null,
        buttonLink: null,
      };
    }*/
    //this.emailOutCopy = JSON.parse(JSON.stringify(this.emailOut));
    /*if (this.emailOutCopy) {
      if (!this.emailOutCopy.icon) {
        this.emailOutCopy.icon = this.appLogo;
      }
    }*/

    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      subject: [this.emailOutCopy.subject, [Validators.required]],
      body: [this.emailOutCopy.body, [Validators.required]],
      icon: [this.emailOutCopy.icon],
      buttonLabel: [this.emailOutCopy.buttonLabel],
      buttonLink: [this.emailOutCopy.buttonLink],
    });
  }

  getImage() {
    /*if (this.dataForm && this.dataForm.value && this.dataForm.value.icon) {
      return this.dataForm.value.icon;
    }*/
    if (this.imageUploadComponent && this.imageUploadComponent.imageSrc) {
      return this.imageUploadComponent.imageSrc;
    }
    return this.appLogo;
  }

  getAppLogo() {
    //return "assets/images/favicon.png";
    return "assets/images/2Dview_logo.png";
    return this.appLogo;
  }

  getContent() {
    if (this.dataForm && this.dataForm.value && this.dataForm.value.body) {
      let content = this.dataForm.value.body;

      /*if (content.indexOf("ql-align-center") > -1) {
        content = content.split("ql-align-center").join("textCenter");
      }*/

      return content;
    }
    return "";
  }

  urlify(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(exp, "<a target='_blank' href='$1'>$1</a>");
  }

  hasFooter() {
    if (this.dataForm && this.dataForm.value) {
      if (this.dataForm.value.buttonLabel && this.dataForm.value.buttonLink) {
        return true;
      }
    }
    return false;
  }

  getBtnLabel() {
    if (
      this.dataForm &&
      this.dataForm.value &&
      this.dataForm.value.buttonLabel
    ) {
      return this.dataForm.value.buttonLabel;
    }
    return "";
  }

  getSupportedMacros() {
    let supportedMacros = [];
    if (this.selectedMailType && this.selectedMailType.supportedMacros) {
      supportedMacros = this.selectedMailType.supportedMacros.split(",");
    }
    /*return [
      "External",
      "Playlist",
      "Share Playlist",
      "External",
      "Playlist",
      "Share Playlist",
      "External",
      "Playlist",
      "Share Playlist",
      "External",
      "Playlist",
      "Share Playlist",
      "External",
      "Playlist",
      "Share Playlist",
      "External",
      "Playlist",
      "Share Playlist",
    ];*/
    return supportedMacros;
  }

  getBtnLink() {
    if (
      this.dataForm &&
      this.dataForm.value &&
      this.dataForm.value.buttonLink
    ) {
      return this.dataForm.value.buttonLink;
    }
    return "";
  }

  onUploadChange(e: any) {
    this.emailOutCopy.icon = "";
    if (e.type === "success") {
      this.emailOutCopy.icon = e.fileDownloadUri;
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
    this.dataForm.controls.icon.setValue(this.emailOutCopy.icon);
    this.updateMailtemplateById();
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  async clickHandler(template: any) {
    if (this.selectedMailType && this.selectedMailType.id === template.id) {
      return;
    }
    this.selectedMailType = template;
    await this.getMailtemplateById(this.selectedMailType.id);
  }

  isSelected(template: any) {
    if (this.selectedMailType && this.selectedMailType.id === template.id) {
      return true;
    }
    return false;
  }

  onPreview(): void {
    this.isVisible = true;
  }

  onSave(): void {
    if (this.imageUploadComponent.isChanged) {
      this.imageUploadComponent.handleUpload();
    } else {
      this.updateMailtemplateById();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  async getStudio(id: any) {
    this.appLogo = this.helperService.defaultAppLogo;
    await this.adminDashboardService
      .getStudio(id)
      .toPromise()
      .then((resp) => {
        this.studioOut = resp.entity;
        if (this.studioOut && this.studioOut.studioLogo) {
          this.appLogo = this.studioOut.studioLogo;
        }
      })
      .catch((error) => {
        this.studioOut = null;
      });
  }

  async getMailTypes() {
    await this.templatesService
      .getMailTypes()
      .toPromise()
      .then((resp: any) => {
        this.mailTypes = resp.entity;
      })
      .catch((error: any) => {
        this.mailTypes = [];
      });
  }

  getMailTypeById(id: any) {}

  async getMailtemplateById(id: any) {
    this.isImageReady = false;
    await this.templatesService
      .getMailtemplateById(id)
      .toPromise()
      .then((resp: any) => {
        this.emailOut = resp.entity;
        this.emailOutCopy = JSON.parse(JSON.stringify(this.emailOut));
        this.buildFormData();
        this.isImageReady = true;
      })
      .catch((error: any) => {
        this.emailOut = null;
      });
  }

  async updateMailtemplateById() {
    let postObj = this.dataForm.value;
    postObj.id = this.emailOutCopy.id;
    postObj.mailTypeId = this.emailOutCopy.mailTypeId;
    //postObj.body = this.getContent();

    let successMessage = "Email template has been successfully updated.";
    let errorMessage = "Email template updation failed.";
    await this.templatesService
      .updateMailTemplate(postObj)
      .toPromise()
      .then((resp: any) => {
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
  }
}
