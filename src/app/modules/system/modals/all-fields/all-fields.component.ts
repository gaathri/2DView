import { Component, OnInit, Input } from "@angular/core";
import { ShowsService } from "../../shows/shows.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd";
import { SystemSettingsService } from "../../configs/system-settings.service";

@Component({
  selector: "app-all-fields",
  templateUrl: "./all-fields.component.html",
  styleUrls: ["./all-fields.component.scss"],
})
export class AllFieldsComponent implements OnInit {
  @Input() showOutCopy: any;
  @Input() mode: any;
  @Input() callback: any;

  isDataReady: boolean;
  clients: any;
  shotAttributes: any;
  servers: any;
  mainForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private showsService: ShowsService,
    private systemSettingsService: SystemSettingsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.prepareData();
    this.drawerRef.afterClose.subscribe((data) => {
      this.callback(this.mainForm.value, this.mainForm.valid);
    });
  }

  async prepareData() {
    await this.getClientList();
    await this.getShotAttributes();
    await this.getServers();

    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.mainForm = this.fb.group({
      clientId: [this.showOutCopy.clientId, [Validators.required]],
      shotAttributes: [this.showOutCopy.shotAttributes, [Validators.required]],
      sourceFileLoc: [this.showOutCopy.sourceFileLoc, [Validators.required]],
      server: [this.showOutCopy.server, [Validators.required]],
    });
  }

  async getClientList() {
    await this.showsService
      .getClientList()
      .toPromise()
      .then((resp: any) => {
        this.clients = resp.entity;
      })
      .catch((error: any) => {
        this.clients = [];
      });
  }

  async getShotAttributes() {
    await this.showsService
      .getShotAttributes()
      .toPromise()
      .then((resp: any) => {
        this.shotAttributes = resp.entity;
      })
      .catch((error: any) => {
        this.shotAttributes = [];
      });
  }

  async getServers() {
    await this.systemSettingsService
      .getStorageServers()
      .toPromise()
      .then((resp: any) => {
        if (resp.entity && resp.entity.storageServers) {
          this.servers = resp.entity.storageServers;
        }
      })
      .catch((error: any) => {
        this.servers = [];
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
