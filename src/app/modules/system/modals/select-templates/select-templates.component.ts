import { Component, OnInit, Input } from "@angular/core";
import { ShowsService } from "../../shows/shows.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd";

@Component({
  selector: "app-select-templates",
  templateUrl: "./select-templates.component.html",
  styleUrls: ["./select-templates.component.scss"],
})
export class SelectTemplatesComponent implements OnInit {
  @Input() showOutCopy: any;
  @Input() mode: any;
  @Input() callback: any;

  isDataReady: boolean;
  showTemplates: any;
  shotTemplates: any;
  packingTemplates: any;
  taskTemplates: any;
  mainForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private showsService: ShowsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.prepareData();
    this.drawerRef.afterClose.subscribe((data) => {
      this.callback(this.mainForm.value, this.mainForm.valid);
    });
  }

  async prepareData() {
    await this.getShowTemplates();
    await this.getShotTemplates();
    await this.getPackingTemplates();
    await this.getTaskTemplates();
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.mainForm = this.fb.group({
      showTemplateId: [this.showOutCopy.showTemplateId, [Validators.required]],
      shotTemplateId: [this.showOutCopy.shotTemplateId, [Validators.required]],
      //taskTemplateId: [this.showOutCopy.taskTemplateId],
      packTemplateIds: [this.showOutCopy.packTemplateIds],
    });
  }

  async getShowTemplates() {
    await this.showsService
      .getShowTemplates()
      .toPromise()
      .then((resp: any) => {
        this.showTemplates = resp.entity;
      })
      .catch((error: any) => {
        this.showTemplates = [];
      });
  }

  async getShotTemplates() {
    await this.showsService
      .getShotTemplates()
      .toPromise()
      .then((resp: any) => {
        this.shotTemplates = resp.entity;
      })
      .catch((error: any) => {
        this.shotTemplates = [];
      });
  }

  async getPackingTemplates() {
    await this.showsService
      .getPackingTemplates()
      .toPromise()
      .then((resp: any) => {
        this.packingTemplates = resp.entity;
      })
      .catch((error: any) => {
        this.packingTemplates = [];
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

  onChange($event: string[]): void {}

  submitHandler() {
    for (const i in this.mainForm.controls) {
      this.mainForm.controls[i].markAsDirty();
      this.mainForm.controls[i].updateValueAndValidity();
    }
    if (!this.mainForm.valid) {
      return;
    }
  }
}
