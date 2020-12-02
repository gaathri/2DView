import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER,CUSTOM_ELEMENTS_SCHEMA  } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IconsProviderModule } from "./icons-provider.module";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { NgHttpLoaderModule } from "ng-http-loader";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AddNewComponent } from "./modules/system/modals/add-new/add-new.component";
import { RoleFormComponent } from "./modules/system/modals/role-form/role-form.component";
import { AuthGuard } from "./modules/core/authentication/auth.guard";
import { AuthenticationService } from "./modules/core/authentication/authentication.service";
import { AccountRoutingModule } from "./modules/account/account-routing.module";
import { AccountModule } from "./modules/account/account.module";
import { SystemModule } from "./modules/system/system.module";
import { SystemRoutingModule } from "./modules/system/system-routing.module";
import { ShowFormComponent } from "./modules/system/modals/show-form/show-form.component";
import { AssignUsersComponent } from "./modules/system/modals/assign-users/assign-users.component";
import { SelectTemplatesComponent } from "./modules/system/modals/select-templates/select-templates.component";
import { AllFieldsComponent } from "./modules/system/modals/all-fields/all-fields.component";
import { ShotFormComponent } from "./modules/system/modals/shot-form/shot-form.component";
import { ShotAllFieldsComponent } from "./modules/system/modals/shot-all-fields/shot-all-fields.component";
import { LoaderComponent } from "./modules/shared/components/loader/loader.component";
import { TableColumnsSettingsComponent } from "./modules/system/modals/table-columns-settings/table-columns-settings.component";
import { TaskFormComponent } from "./modules/system/modals/task-form/task-form.component";
import { EpisodeFormComponent } from "./modules/system/modals/episode-form/episode-form.component";
import { SequenceFormComponent } from "./modules/system/modals/sequence-form/sequence-form.component";
import { SeasonFormComponent } from "./modules/system/modals/season-form/season-form.component";
import { AssetFormComponent } from "./modules/system/modals/asset-form/asset-form.component";
import { NewStepFormComponent } from "./modules/system/modals/new-step-form/new-step-form.component";
import { GroupFormComponent } from "./modules/system/modals/group-form/group-form.component";
import { GroupAssignUsersComponent } from "./modules/system/modals/group-assign-users/group-assign-users.component";
import { DepartmentFormComponent } from "./modules/system/modals/department-form/department-form.component";
import { TasktypeFormComponent } from "./modules/system/modals/tasktype-form/tasktype-form.component";
import { WorkstatusFormComponent } from "./modules/system/modals/workstatus-form/workstatus-form.component";
import { PriorityFormComponent } from "./modules/system/modals/priority-form/priority-form.component";
import { ClientFormComponent } from "./modules/system/modals/client-form/client-form.component";
import { SpotFormComponent } from "./modules/system/modals/spot-form/spot-form.component";
import { UserFormComponent } from "./modules/system/modals/user-form/user-form.component";
import { ShotFilterSettingsComponent } from "./modules/system/modals/shot-filter-settings/shot-filter-settings.component";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { ManualInsertionComponent } from "./modules/system/modals/manual-insertion/manual-insertion.component";
import { ImportCsvComponent } from "./modules/system/modals/import-csv/import-csv.component";
import { TokenInterceptor } from "./modules/core/services/http.token.interceptor";
import { ArtistDbSettingsComponent } from "./modules/system/modals/artist-db-settings/artist-db-settings.component";
import { StudioDbSettingsComponent } from "./modules/system/modals/studio-db-settings/studio-db-settings.component";
import { TaskFilterSettingsComponent } from "./modules/system/modals/task-filter-settings/task-filter-settings.component";
import { TaskLogFormComponent } from "./modules/system/modals/task-log-form/task-log-form.component";
import { ReportFilterSettingsComponent } from "./modules/system/modals/report-filter-settings/report-filter-settings.component";
import { UserListFormComponent } from "./modules/system/modals/user-list-form/user-list-form.component";
import { ReportFormComponent } from "./modules/system/modals/report-form/report-form.component";
import { ReportInstanceListComponent } from "./modules/system/modals/report-instance-list/report-instance-list.component";
import { NotificationsComponent } from "./modules/system/modals/notifications/notifications.component";
import { MyAccountFormComponent } from "./modules/system/modals/my-account-form/my-account-form.component";
import { NoteFormComponent } from "./modules/system/modals/note-form/note-form.component";
import { QuillModule } from "ngx-quill";
import { BackupFormComponent } from "./modules/system/modals/backup-form/backup-form.component";
import { DailiesFilterSettingsComponent } from "./modules/system/modals/dailies-filter-settings/dailies-filter-settings.component";
import { SharePlaylistComponent } from "./modules/system/modals/share-playlist/share-playlist.component";
import { HolidayFormComponent } from "./modules/system/modals/holiday-form/holiday-form.component";
import { LeaveFormComponent } from "./modules/system/modals/leave-form/leave-form.component";
import { ReviewFormComponent } from "./modules/system/modals/review-form/review-form.component";
import { CustomFieldFormComponent } from "./modules/system/modals/custom-field-form/custom-field-form.component";
import { CustomFieldComponent } from "./modules/system/modals/custom-field/custom-field.component";

import { KeycloakService, KeycloakAngularModule } from "keycloak-angular";
import { initializer } from "./utils/app-init";
import { PlaylistFormComponent } from "./modules/system/modals/playlist-form/playlist-form.component";
import { GanttFilterSettingsComponent } from "./modules/system/modals/gantt-filter-settings/gantt-filter-settings.component";
import { TimeSheetFilterSettingsComponent } from "./modules/system/modals/time-sheet-filter-settings/time-sheet-filter-settings.component";
import { OfficeLocationFormComponent } from "./modules/system/modals/office-location-form/office-location-form.component";
import { DaybookFilterComponent } from "./modules/system/modals/daybook-filter/daybook-filter.component";
import { NotificationSettingsComponent } from "./modules/system/modals/notification-settings/notification-settings.component";
import { ShotAssetStatusFormComponent } from "./modules/system/modals/shot-asset-status-form/shot-asset-status-form.component";
import { AssetFilterSettingsComponent } from "./modules/system/modals/asset-filter-settings/asset-filter-settings.component";

import { ModalModule } from './modules/shared/components/_modal';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    AddNewComponent,
    RoleFormComponent,
    LoaderComponent,
    
  ],
  imports: [
    AccountModule,
    AccountRoutingModule,
    SystemModule,
    SystemRoutingModule,
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    NgHttpLoaderModule.forRoot(),
    QuillModule.forRoot(),
    KeycloakAngularModule,
    ModalModule
  ],
  entryComponents: [
    AddNewComponent,
    RoleFormComponent,
    ShowFormComponent,
    TaskFormComponent,
    AssignUsersComponent,
    SelectTemplatesComponent,
    AllFieldsComponent,
    ShotFormComponent,
    ShotAllFieldsComponent,
    TableColumnsSettingsComponent,
    SequenceFormComponent,
    EpisodeFormComponent,
    SeasonFormComponent,
    SpotFormComponent,
    AssetFormComponent,
    NewStepFormComponent,
    GroupFormComponent,
    GroupAssignUsersComponent,
    DepartmentFormComponent,
    TasktypeFormComponent,
    WorkstatusFormComponent,
    PriorityFormComponent,
    ClientFormComponent,
    UserFormComponent,
    ShotFilterSettingsComponent,
    ManualInsertionComponent,
    ImportCsvComponent,
    ArtistDbSettingsComponent,
    StudioDbSettingsComponent,
    TaskFilterSettingsComponent,
    TaskLogFormComponent,
    ReportFilterSettingsComponent,
    UserListFormComponent,
    ReportFormComponent,
    ReportInstanceListComponent,
    NotificationsComponent,
    MyAccountFormComponent,
    NoteFormComponent,
    BackupFormComponent,
    HolidayFormComponent,
    LeaveFormComponent,
    DailiesFilterSettingsComponent,
    SharePlaylistComponent,
    ReviewFormComponent,
    CustomFieldFormComponent,
    CustomFieldComponent,
    PlaylistFormComponent,
    GanttFilterSettingsComponent,
    TimeSheetFilterSettingsComponent,
    OfficeLocationFormComponent,
    DaybookFilterComponent,
    NotificationSettingsComponent,
    ShotAssetStatusFormComponent,
    AssetFilterSettingsComponent,
    LoaderComponent,
    
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService],
    },

    //{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
