import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-custom-field",
  templateUrl: "./custom-field.component.html",
  styleUrls: ["./custom-field.component.scss"],
})
export class CustomFieldComponent implements OnInit {
  @Input() mode: any;
  @Input() parentOutCopy: any;
  @Input() callback: any;
  @Input() customFields: any;

  isDataReady: boolean;
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private fb: FormBuilder,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.prepareData();
    this.drawerRef.afterClose.subscribe((data) => {
      let customFields = JSON.parse(JSON.stringify(this.customFields));
      for (let i = 0; i < customFields.length; i++) {
        let customField = customFields[i];
        customField.value = this.dataForm.value[customField.name];
        if (customField.format === "Datetime" && customField.value) {
          customField.value = this.helperService.transformDate(
            customField.value,
            this.getDisplayDateFormat()
          );
        }
      }
      this.callback(customFields, this.dataForm.valid);
    });
  }

  async prepareData() {
    if (
      this.parentOutCopy.customFields &&
      this.parentOutCopy.customFields.length > 0
    ) {
      let c = this.customFields.filter(
        (o) => !this.parentOutCopy.customFields.find((o2) => o.id === o2.id)
      );
      if (c && c.length > 0) {
        c = JSON.parse(JSON.stringify(c));
        this.customFields = this.parentOutCopy.customFields.concat(c);
      } else {
        this.customFields = this.parentOutCopy.customFields;
      }
    }

    /*this.customFields = [
      {
        name: "CustomField1",
        isMandatory: true,
        format: "Integer",
        value: 1234,
      },
      {
        name: "CustomField2",
        isMandatory: true,
        format: "String",
        value: "ASDF",
      },
      {
        name: "CustomField3",
        isMandatory: true,
        format: "Datetime",
        value: "",
      },
    ];*/
    this.buildFormData();
    this.isDataReady = true;
  }

  isValidDate(ds: any) {
    var date = new Date(ds);
    return date.getTime() === date.getTime();
  }

  getFormattedDate(_date) {
    if (this.isValidDate(_date)) {
      return _date;
    }
    var _format = "dd-MM-yyyy";
    var _delimiter = "-";
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(
      dateItems[yearIndex],
      month,
      dateItems[dayIndex]
    );
    return formatedDate;
  }

  buildFormData() {
    this.dataForm = this.fb.group({});
    let customFields = this.customFields;
    for (let i = 0; i < customFields.length; i++) {
      let customField = customFields[i];
      if (customField.format === "Datetime" && customField.value) {
        this.dataForm.addControl(
          customField.name,
          this.fb.control(this.getFormattedDate(customField.value))
        );
      } else {
        this.dataForm.addControl(
          customField.name,
          this.fb.control(customField.value)
        );
      }

      if (customField.isMandatory) {
        this.dataForm.get(customField.name)!.setValidators(Validators.required);
      }
    }
  }

  getCustomFields() {
    return this.customFields;
  }

  getFormat(customField: any) {
    return customField.format;
  }

  isRequired(control: any) {
    if (
      this.dataForm.controls[control] &&
      this.dataForm.controls[control].validator
    ) {
      let validators = this.dataForm.controls[control].validator(control);
      if (validators && validators.hasOwnProperty("required")) {
        return true;
      }
    }
    return false;
  }

  submitHandler() {}

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
