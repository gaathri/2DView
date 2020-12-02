import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { SystemSettingsService } from "../system-settings.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { NotificationService } from "src/app/modules/core/services/notification.service";

@Component({
  selector: "app-settings-tab",
  templateUrl: "./settings-tab.component.html",
  styleUrls: ["./settings-tab.component.scss"],
})
export class SettingsTabComponent implements OnInit {
  @ViewChild("display", { static: false }) displayTemplate: TemplateRef<{}>;
  @ViewChild("security", { static: false }) securityTemplate: TemplateRef<{}>;
  @ViewChild("smtp", { static: false }) smtpTemplate: TemplateRef<{}>;
  @ViewChild("storage", { static: false }) storageTemplate: TemplateRef<{}>;
  @ViewChild("backup", { static: false }) backupTemplate: TemplateRef<{}>;
  @ViewChild("other", { static: false }) otherTemplate: TemplateRef<{}>;
  //@ViewChild("ldap", { static: false }) ldapTemplate: TemplateRef<{}>;

  isDataReady: boolean = false;
  displayForm: FormGroup;
  securityForm: FormGroup;
  smtpForm: FormGroup;
  storageForms: any;
  backupForm: FormGroup;
  backupForms: any;
  otherForm: FormGroup;
  //ldapForm: FormGroup;

  tabDetails: any;
  configData: any;
  passwordComplexityList: any;
  rules: any;

  displaySettings: any;
  securitySettings: any;
  smtpSettings: any;
  smtpPasswordVisible = false;
  storageSettings: any;
  backupSettings: any;
  otherSettings: any;
  //ldapSettings: any;

  selectedIndex = 0;
  lastSelectedIndex = 0;

  backupServers: any;

  storageServers: any;
  PASSWORD_EXPIRY_MIN = 30;
  PASSWORD_EXPIRY_MAX = 365;
  EMAIL_EXPIRY_MIN = 5;
  EMAIL_EXPIRY_MAX = 500;
  LOGIN_ATTEMPT_MIN = 1;
  LOGIN_ATTEMPT_MAX = 10;
  SESSION_EXPIRY_MIN = 1;
  SESSION_EXPIRY_MAX = 15;
  UNBLOCK_MIN = 1;
  UNBLOCK_MAX = 10;

  WORKLOG_LIMIT_MIN = 10;
  WORKLOG_LIMIT_MAX = 90;

  constructor(
    private interactionService: InteractionService,
    private fb: FormBuilder,
    private systemSettingsService: SystemSettingsService,
    private helperService: HelperService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "System Settings");
    this.helperService.isGlobalAddEnabled = true;
    this.prepareData();
  }

  onTabChange(e: any) {
    this.lastSelectedIndex = e.index;
  }

  getDataByConfigKeyCode(key: any) {
    return this.helperService.findObjectInArrayByKey(
      this.configData,
      "configKeyCode",
      key
    );
  }

  complexityChangeHandler(e) {
    if (e) {
      this.frameRulesList(e);
    }
  }

  frameRulesList(e: any) {
    const obj = this.helperService.findObjectInArrayByKey(
      this.securitySettings.passwordComplexity.values,
      "id",
      e
    );

    if (obj.configKeyValue) {
      let passwordComplexity = this.helperService.findObjectInArrayByKey(
        this.passwordComplexityList,
        "complexity",
        obj.configKeyValue
      );
      this.rules = passwordComplexity.rules;
    }
  }

  async prepareData() {
    this.isDataReady = false;
    this.selectedIndex = this.lastSelectedIndex;
    await this.getConfigData();
    await this.getPasswordComplexityList();
    this.displaySettings = {
      lang: this.getDataByConfigKeyCode("LANG"),
      weekStart: this.getDataByConfigKeyCode("WEEK_START"),
      weekEnds: this.getDataByConfigKeyCode("WEEKENDS"),
      dateFormat: this.getDataByConfigKeyCode("DATE_FORMAT"),
      timeFormat: this.getDataByConfigKeyCode("TIME_FORMAT"),
      timeZone: this.getDataByConfigKeyCode("TIME_ZONE"),
      worklogLimit: this.getDataByConfigKeyCode("WORKLOG_LIMIT"),
    };

    this.securitySettings = {
      emailExpiry: this.getDataByConfigKeyCode("EMAIL_EXPIRY"),
      loginAttempt: this.getDataByConfigKeyCode("MAX_LOGIN_ATTEMPT"),
      sessionExpiry: this.getDataByConfigKeyCode("SESSION_EXPIRY"),
      unblockMinTime: this.getDataByConfigKeyCode("UNBLOCK_MIN_TIME"),
      passwordExpiry: this.getDataByConfigKeyCode("PASSWORD_EXPIRY"),
      passwordComplexity: this.getDataByConfigKeyCode("PASSWORD_COMPLEXITY"),
    };

    this.smtpSettings = {
      server: this.getDataByConfigKeyCode("SMTP_SERVER"),
      port: this.getDataByConfigKeyCode("SMTP_PORT"),
      domain: this.getDataByConfigKeyCode("SMTP_DOMAIN"),
      authentication: this.getDataByConfigKeyCode("SMTP_AUTH"),
      username: this.getDataByConfigKeyCode("SMTP_USER"),
      password: this.getDataByConfigKeyCode("SMTP_PASSWORD"),
    };

    this.otherSettings = {
      ffmpeg: this.getDataByConfigKeyCode("FFMPEG_SETTINGS"),
    };

    /*this.backupSettings = {
      backupServer: this.getDataByConfigKeyCode("BACKUP_SERVER"),
    };*/

    /*this.ldapSettings = {
      server: this.getDataByConfigKeyCode("LDAP_SERVER"),
      username: this.getDataByConfigKeyCode("LDAP_USERNAME"),
      password: this.getDataByConfigKeyCode("LDAP_PASSWORD"),
    };*/

    this.backupSettings = this.getDataByConfigKeyCode("BACKUP_SERVER");

    this.storageSettings = this.getDataByConfigKeyCode("STORAGE_SERVER");

    this.buildFormInfo();
    this.buildTabInfo();
    this.isDataReady = true;
  }

  async getConfigData() {
    await this.systemSettingsService
      .getConfig()
      .toPromise()
      .then((resp: any) => {
        this.configData = resp.entity;
      })
      .catch((error: any) => {
        this.configData = [];
      });
  }

  async getPasswordComplexityList() {
    await this.systemSettingsService
      .getPasswordComplexityList()
      .toPromise()
      .then((resp: any) => {
        this.passwordComplexityList = resp.entity;
      })
      .catch((error: any) => {
        this.passwordComplexityList = [];
      });
  }

  buildFormInfo() {
    this.otherForm = this.fb.group({
      ffmpeg: [
        this.getSettingsValue(this.otherSettings, "ffmpeg", "text"),
        [Validators.required],
      ],
    });
    this.displayForm = this.fb.group({
      lang: [
        this.getSettingsValue(this.displaySettings, "lang"),
        [Validators.required],
      ],
      weekStart: [
        this.getSettingsValue(this.displaySettings, "weekStart"),
        [Validators.required],
      ],
      weekEnds: [
        this.getSettingsValue(this.displaySettings, "weekEnds", "array"),
        [Validators.required],
      ],
      dateFormat: [
        this.getSettingsValue(this.displaySettings, "dateFormat"),
        [Validators.required],
      ],
      timeFormat: [
        this.getSettingsValue(this.displaySettings, "timeFormat"),
        [Validators.required],
      ],
      timeZone: [
        this.getSettingsValue(this.displaySettings, "timeZone"),
        [Validators.required],
      ],
      worklogLimit: [
        this.getSettingsValue(this.displaySettings, "worklogLimit"),
        [
          Validators.required,
          Validators.min(this.WORKLOG_LIMIT_MIN),
          Validators.max(this.WORKLOG_LIMIT_MAX),
        ],
      ],
    });

    this.securityForm = this.fb.group({
      emailExpiry: [
        this.getSettingsValue(this.securitySettings, "emailExpiry"),
        [
          Validators.required,
          Validators.min(this.EMAIL_EXPIRY_MIN),
          Validators.max(this.EMAIL_EXPIRY_MAX),
        ],
      ],

      loginAttempt: [
        this.getSettingsValue(this.securitySettings, "loginAttempt"),
        [
          Validators.required,
          Validators.min(this.LOGIN_ATTEMPT_MIN),
          Validators.max(this.LOGIN_ATTEMPT_MAX),
        ],
      ],
      sessionExpiry: [
        this.getSettingsValue(this.securitySettings, "sessionExpiry"),
        [
          Validators.required,
          Validators.min(this.SESSION_EXPIRY_MIN),
          Validators.max(this.SESSION_EXPIRY_MAX),
        ],
      ],
      unblockMinTime: [
        this.getSettingsValue(this.securitySettings, "unblockMinTime"),
        [
          Validators.required,
          Validators.min(this.UNBLOCK_MIN),
          Validators.max(this.UNBLOCK_MAX),
        ],
      ],
      passwordExpiry: [
        this.getSettingsValue(this.securitySettings, "passwordExpiry"),
        [
          Validators.required,
          Validators.min(this.PASSWORD_EXPIRY_MIN),
          Validators.max(this.PASSWORD_EXPIRY_MAX),
        ],
      ],
      passwordComplexity: [
        this.getSettingsValue(this.securitySettings, "passwordComplexity"),
        [Validators.required],
      ],
    });
    let complexityId = this.getSettingsValue(
      this.securitySettings,
      "passwordComplexity"
    );

    if (complexityId) {
      this.frameRulesList(complexityId);
    }

    this.smtpForm = this.fb.group({
      server: [
        this.getSettingsValue(this.smtpSettings, "server", "text"),
        [Validators.required],
      ],
      port: [
        this.getSettingsValue(this.smtpSettings, "port", "text"),
        [Validators.required],
      ],
      domain: [
        this.getSettingsValue(this.smtpSettings, "domain", "text"),
        [Validators.required, Validators.email],
      ],
      /*authentication: [
        this.getSettingsValue(this.smtpSettings, "authentication", "text"),
        [Validators.required],
      ],*/
      username: [
        this.getSettingsValue(this.smtpSettings, "username", "text"),
        [Validators.required],
      ],
      password: [
        this.getSettingsValue(this.smtpSettings, "password", "text"),
        [Validators.required],
      ],
    });

    /*this.backupForm = this.fb.group({
      backupServer: [
        this.getSettingsValue(this.backupSettings, "backupServer", "text"),
        [Validators.required],
      ],
    });*/

    if (
      this.backupSettings &&
      this.backupSettings.settings &&
      this.backupSettings.settings.backupServers
    ) {
      this.backupServers = this.backupSettings.settings.backupServers;
    }

    if (this.helperService.isValidArr(this.backupServers)) {
      this.backupForms = [];
      for (let i = 0; i < this.backupServers.length; i++) {
        let server = this.backupServers[i];
        let backupForm = this.fb.group({
          userName: [server.userName, [Validators.required]],
          password: [server.password, [Validators.required]],
          server: [server.server, [Validators.required]],
        });
        this.backupForms.push({
          form: backupForm,
          showPassword: false,
        });
      }
    }

    /*this.ldapForm = this.fb.group({
      server: [
        this.getSettingsValue(this.ldapSettings, "server", "text"),
        [Validators.required],
      ],
      username: [
        this.getSettingsValue(this.ldapSettings, "username", "text"),
        [Validators.required],
      ],
      password: [
        this.getSettingsValue(this.ldapSettings, "password", "text"),
        [Validators.required],
      ],
    });*/

    if (
      this.storageSettings &&
      this.storageSettings.settings &&
      this.storageSettings.settings.storageServers
    ) {
      this.storageServers = this.storageSettings.settings.storageServers;
    }

    if (this.helperService.isValidArr(this.storageServers)) {
      this.storageForms = [];
      for (let i = 0; i < this.storageServers.length; i++) {
        let server = this.storageServers[i];
        let storageForm = this.fb.group({
          userName: [server.userName, [Validators.required]],
          password: [server.password, [Validators.required]],
          server: [server.server, [Validators.required]],
        });
        this.storageForms.push({
          form: storageForm,
          showPassword: false,
        });
      }
    }
  }

  removeBackupForm(item: any) {
    let removeIndex = this.backupForms.indexOf(item);
    this.backupForms = this.backupForms.filter((item: any, index: any) => {
      return index != removeIndex;
    });
  }

  addBackupForm() {
    let backupForm = this.fb.group({
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]],
      server: ["", [Validators.required]],
    });
    if (!this.helperService.isValidArr(this.backupForms)) {
      this.backupForms = [];
    }
    this.backupForms.push({
      form: backupForm,
      showPassword: false,
    });
  }

  removeStorageForm(item: any) {
    let removeIndex = this.storageForms.indexOf(item);
    this.storageForms = this.storageForms.filter((item: any, index: any) => {
      return index != removeIndex;
    });
  }

  addStorageForm() {
    let storageForm = this.fb.group({
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]],
      server: ["", [Validators.required]],
    });
    if (!this.helperService.isValidArr(this.storageForms)) {
      this.storageForms = [];
    }
    this.storageForms.push({
      form: storageForm,
      showPassword: false,
    });
  }

  getSettingsValue(setting: any, key: any, type?: any) {
    if (setting && setting[key] && setting[key].settings) {
      if (type === "array" && setting[key].settings.configKeyValues) {
        return setting[key].settings.configKeyValues.map(Number);
      } else if (setting[key].settings.configKeyValue) {
        if (type && type === "text") {
          return setting[key].settings.configKeyValue;
        } else {
          return Number(setting[key].settings.configKeyValue);
        }
      }
    }
    return null;
  }

  buildTabInfo() {
    this.tabDetails = [
      {
        id: "display",
        tabIcon: "desktop_windows",
        tabTitle: "Display",
        tabContentTitle: "Display Settings",
      },
      {
        id: "security",
        tabIcon: "security",
        tabTitle: "Security",
        tabContentTitle: "Security Settings",
      },
      {
        id: "smtp",
        tabIcon: "email",
        tabTitle: "SMTP",
        tabContentTitle: "SMTP Settings",
      },
      {
        id: "storage",
        tabIcon: "account_circle",
        tabTitle: "Storage Authentication",
        tabContentTitle: "Storage Authentication Settings",
      },
      {
        id: "backup",
        tabIcon: "backup",
        tabTitle: "Backup Server",
        tabContentTitle: "Backup Server Settings",
      },
      {
        id: "other",
        tabIcon: "more",
        tabTitle: "Others",
        tabContentTitle: "Other Settings",
      },

      /*{
        id: "ldap",
        tabIcon: "backup",
        tabTitle: "LDAP Server",
        tabContentTitle: "LDAP Server Settings",
      },*/
    ];
  }

  getTabContentTemplate(id: any) {
    return this[id + "Template"];
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  async submitDisplayForm() {
    for (const i in this.displayForm.controls) {
      this.displayForm.controls[i].markAsDirty();
      this.displayForm.controls[i].updateValueAndValidity();
    }
    if (!this.displayForm.valid) {
      return;
    }
    let postObj = {
      settings: [],
    };
    for (let i in this.displayForm.value) {
      let settings = {};
      if (this.displaySettings[i].values) {
        let arr = this.displaySettings[i].values;
        let value = this.displayForm.value[i];
        if (this.displaySettings[i].settings) {
          settings = this.displaySettings[i].settings;
        } else {
        }
        if (Array.isArray(value)) {
          settings["configKeyValues"] = [];
          for (let index = 0; index < value.length; index++) {
            let obj = this.helperService.findObjectInArrayByKey(
              arr,
              "id",
              value[index]
            );
            if (obj) {
              settings["configKeyId"] = obj.configKeyId;
              settings["configKeyValues"].push(obj.id);
            }
          }
        } else {
          let obj = this.helperService.findObjectInArrayByKey(arr, "id", value);
          settings["configKeyId"] = obj.configKeyId;
          settings["configKeyValue"] = String(obj.id);
        }
      } else {
        if (this.displaySettings[i].settings) {
          settings = this.displaySettings[i].settings;
        }
        settings["configKeyId"] = this.displaySettings[i].id;
        settings["configKeyValue"] = this.displayForm.value[i];
      }

      postObj.settings.push(settings);
    }
    await this.systemSettingsService
      .addSettings(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Settings has been successfully updated.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: "Settings updation failed.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  async submitOtherForm() {
    for (const i in this.otherForm.controls) {
      this.otherForm.controls[i].markAsDirty();
      this.otherForm.controls[i].updateValueAndValidity();
    }
    if (!this.otherForm.valid) {
      return;
    }
    let postObj = {
      settings: [],
    };
    for (let i in this.otherForm.value) {
      let settings = {};
      if (this.otherSettings[i].values) {
        let arr = this.otherSettings[i].values;
        let value = this.otherForm.value[i];
        let obj = this.helperService.findObjectInArrayByKey(arr, "id", value);

        if (this.otherSettings[i].settings) {
          settings = this.otherSettings[i].settings;
        }
        settings["configKeyId"] = obj.configKeyId;
        settings["configKeyValue"] = String(obj.id);
      } else {
        if (this.otherSettings[i].settings) {
          settings = this.otherSettings[i].settings;
        }
        settings["configKeyId"] = this.otherSettings[i].id;
        settings["configKeyValue"] = this.otherForm.value[i];
      }
      postObj.settings.push(settings);
    }

    await this.systemSettingsService
      .addSettings(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Settings has been successfully updated.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: "Settings updation failed.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  async submitSecurityForm() {
    for (const i in this.securityForm.controls) {
      this.securityForm.controls[i].markAsDirty();
      this.securityForm.controls[i].updateValueAndValidity();
    }
    if (!this.securityForm.valid) {
      return;
    }
    let postObj = {
      settings: [],
    };
    for (let i in this.securityForm.value) {
      let settings = {};
      if (this.securitySettings[i].values) {
        let arr = this.securitySettings[i].values;
        let value = this.securityForm.value[i];
        let obj = this.helperService.findObjectInArrayByKey(arr, "id", value);

        if (this.securitySettings[i].settings) {
          settings = this.securitySettings[i].settings;
        }
        settings["configKeyId"] = obj.configKeyId;
        settings["configKeyValue"] = String(obj.id);
      } else {
        if (this.securitySettings[i].settings) {
          settings = this.securitySettings[i].settings;
        }
        settings["configKeyId"] = this.securitySettings[i].id;
        settings["configKeyValue"] = this.securityForm.value[i];
      }
      postObj.settings.push(settings);
    }

    await this.systemSettingsService
      .addSettings(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Settings has been successfully updated.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: "Settings updation failed.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  async submitSMTPForm() {
    for (const i in this.smtpForm.controls) {
      this.smtpForm.controls[i].markAsDirty();
      this.smtpForm.controls[i].updateValueAndValidity();
    }

    if (!this.smtpForm.valid) {
      return;
    }
    let postObj = {
      settings: [],
    };
    for (let i in this.smtpForm.value) {
      let settings = {};
      if (this.smtpSettings[i].settings) {
        settings = this.smtpSettings[i].settings;
      }
      settings["configKeyId"] = this.smtpSettings[i].id;
      settings["configKeyValue"] = this.smtpForm.value[i];
      postObj.settings.push(settings);
    }
    await this.systemSettingsService
      .addSettings(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Settings has been successfully updated.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: "Settings updation failed.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  /*async submitLDAPForm() {
    for (const i in this.ldapForm.controls) {
      this.ldapForm.controls[i].markAsDirty();
      this.ldapForm.controls[i].updateValueAndValidity();
    }
    
    if (!this.ldapForm.valid) {
      return;
    }
    let postObj = {
      settings: [],
    };
    for (let i in this.ldapForm.value) {
      let settings = {};
      if (this.ldapSettings[i].settings) {
        settings = this.ldapSettings[i].settings;
      }
      settings["configKeyId"] = this.ldapSettings[i].id;
      settings["configKeyValue"] = this.ldapForm.value[i];
      postObj.settings.push(settings);
    }
    

    await this.systemSettingsService
      .addSettings(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Settings has been successfully updated.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: "Settings updation failed.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }*/

  /*async submitBackupForm() {
    for (const i in this.backupForm.controls) {
      this.backupForm.controls[i].markAsDirty();
      this.backupForm.controls[i].updateValueAndValidity();
    }
    
    if (!this.backupForm.valid) {
      return;
    }
    let postObj = {
      settings: [],
    };
    for (let i in this.backupForm.value) {
      let settings = {};
      if (this.backupSettings[i].settings) {
        settings = this.backupSettings[i].settings;
      }
      settings["configKeyId"] = this.backupSettings[i].id;
      settings["configKeyValue"] = this.backupForm.value[i];
      postObj.settings.push(settings);
    }
    

    await this.systemSettingsService
      .addSettings(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Settings has been successfully updated.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: "Settings updation failed.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }*/

  async submitStorageForm() {
    let storageFormsValid = true;
    let storageServers = [];
    for (let index = 0; index < this.storageForms.length; index++) {
      let storageForm = this.storageForms[index].form;
      for (const i in storageForm.controls) {
        storageForm.controls[i].markAsDirty();
        storageForm.controls[i].updateValueAndValidity();
      }

      if (!storageForm.valid) {
        storageFormsValid = false;
      }
      storageServers.push(storageForm.value);
    }

    if (!storageFormsValid) {
      return;
    }

    let postObj = {
      settings: [],
    };
    let settings = {};
    if (this.storageSettings && this.storageSettings.settings) {
      settings = this.storageSettings.settings;
    } else {
      settings["configKeyId"] = this.storageSettings.id;
    }
    settings["storageServers"] = storageServers;
    postObj.settings[0] = settings;

    await this.systemSettingsService
      .addSettings(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Settings has been successfully updated.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: "Settings updation failed.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }

  async submitBackupForm() {
    let backupFormsValid = true;
    let backupServers = [];
    for (let index = 0; index < this.backupForms.length; index++) {
      let backupForm = this.backupForms[index].form;
      for (const i in backupForm.controls) {
        backupForm.controls[i].markAsDirty();
        backupForm.controls[i].updateValueAndValidity();
      }

      if (!backupForm.valid) {
        backupFormsValid = false;
      }
      backupServers.push(backupForm.value);
    }

    if (!backupFormsValid) {
      return;
    }

    let postObj = {
      settings: [],
    };
    let settings = {};
    if (this.backupSettings && this.backupSettings.settings) {
      settings = this.backupSettings.settings;
    } else {
      settings["configKeyId"] = this.backupSettings.id;
    }
    settings["backupServers"] = backupServers;
    postObj.settings[0] = settings;

    await this.systemSettingsService
      .addSettings(postObj)
      .toPromise()
      .then((resp: any) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: "Settings has been successfully updated.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        this.prepareData();
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: "Settings updation failed.",
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  }
}
