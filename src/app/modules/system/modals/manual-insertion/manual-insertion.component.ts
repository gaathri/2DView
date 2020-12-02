import { Component, OnInit, Input } from "@angular/core";
import { ShowsService } from "../../shows/shows.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { NotificationService } from "src/app/modules/core/services/notification.service";

@Component({
  selector: "app-manual-insertion",
  templateUrl: "./manual-insertion.component.html",
  styleUrls: ["./manual-insertion.component.scss"],
})
export class ManualInsertionComponent implements OnInit {
  @Input() shotOutCopy: any;
  @Input() mode: any;
  @Input() parentDrawerRef: any;

  separators: any;
  paddings: any;
  mainForm: FormGroup;
  isDataReady: boolean;
  //end: any;
  //start: any;
  noOfItems: any;
  isAlertVisible: boolean;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private showsService: ShowsService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.prepareData();
  }
  prepareData() {
    this.separators = [
      {
        id: "_",
        name: "Underscore ( _ )",
      },
      {
        id: "-",
        name: "Hyphen( - )",
      },
      {
        id: " ",
        name: "White Space",
      },
    ];

    this.paddings = [
      {
        id: 1,
        name: "4",
      },
      {
        id: 2,
        name: "04",
      },
      {
        id: 3,
        name: "004",
      },
      {
        id: 4,
        name: "0004",
      },
    ];
    this.buildFormData();
    this.isDataReady = true;
  }
  buildFormData() {
    this.mainForm = this.fb.group({
      showId: [this.shotOutCopy.showId],
      sequenceId: [this.shotOutCopy.sequenceId],
      spotId: [this.shotOutCopy.spotId],
      hasSeparator: [false],
      separator: [null],
      hasPadding: [false],
      padding: [null],
      start: [
        null,
        [
          Validators.required,
          (control: AbstractControl) => Validators.max(this.getMax())(control),
        ],
      ],
      end: [
        null,
        [
          Validators.required,
          (control: AbstractControl) => Validators.min(this.getMin())(control),
        ],
      ],
      interval: [null, [Validators.required, Validators.min(1)]],
    });
    this.requiredChange();
  }

  getMax() {
    if (
      this.mainForm &&
      this.mainForm.controls &&
      this.mainForm.controls.end &&
      this.mainForm.controls.end.value
    ) {
      return Number(this.mainForm.controls.end.value);
    }
    return 50;
  }

  getMin() {
    if (
      this.mainForm &&
      this.mainForm.controls &&
      this.mainForm.controls.start &&
      this.mainForm.controls.start.value
    ) {
      return Number(this.mainForm.controls.start.value);
    }
    return 1;
  }

  showSeparator() {
    let hasSeparator = this.mainForm.controls.hasSeparator.value;
    return hasSeparator;
  }

  showPadding() {
    let hasPadding = this.mainForm.controls.hasPadding.value;
    return hasPadding;
  }

  hasPaddingChange() {
    this.requiredChange();
  }
  hasSeparatorChange() {
    this.requiredChange();
  }

  inputOnChange() {
    this.mainForm.get("start")!.markAsDirty();
    this.mainForm.get("end")!.markAsDirty();
    this.mainForm.get("start")!.updateValueAndValidity();
    this.mainForm.get("end")!.updateValueAndValidity();
  }

  requiredChange(): void {
    let hasSeparator = this.mainForm.controls.hasSeparator.value;
    let hasPadding = this.mainForm.controls.hasPadding.value;
    if (hasSeparator) {
      this.mainForm.get("separator")!.setValidators(Validators.required);
    } else {
      this.mainForm.get("separator")!.clearValidators();
      this.mainForm.controls.separator.setValue(null);
    }
    if (hasPadding) {
      this.mainForm.get("padding")!.setValidators(Validators.required);
    } else {
      this.mainForm.get("padding")!.clearValidators();
      this.mainForm.controls.padding.setValue(null);
    }
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }
  submitHandler() {
    for (const i in this.mainForm.controls) {
      this.mainForm.controls[i].markAsDirty();
      this.mainForm.controls[i].updateValueAndValidity();
    }
    if (!this.mainForm.valid) {
      return;
    }
    this.findNoOfItems();
    this.isAlertVisible = true;
  }
  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }
  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
    this.parentDrawerRef.close(isSuccess);
  }
  async onConfirm() {
    this.isAlertVisible = false;
    let successMessage = AppConstants.MI_SHOT_CREATION_SUCCESS;
    let errorMessage = AppConstants.MI_SHOT_CREATION_ERROR;
    let serviceName = "manualInsertion";
    let isSuccess = false;
    let postObj = this.mainForm.value;
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
  }
  onCancel() {
    this.isAlertVisible = false;
  }

  findNoOfItems() {
    let start = Number(this.mainForm.controls.start.value);
    let end = Number(this.mainForm.controls.end.value);
    let interval = Number(this.mainForm.controls.interval.value);
    let separator = this.mainForm.controls.separator.value;
    let items = [];
    for (let i = start; i <= end; i = i + interval) {
      let item = "Shot" + separator + i;
      items.push(item);
    }
    this.noOfItems = Math.floor((end - start) / interval) + 1;
  }
}
