import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SystemRoutingModule } from "./system-routing.module";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { AutonumericModule } from "@angularfy/autonumeric";
import { HomeComponent } from "./home/home.component";
import { ListingComponent } from "./listing/listing.component";
import { HelpComponent } from "./help/help.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SettingsComponent } from "./settings/settings.component";
import { ShowFormComponent } from "./modals/show-form/show-form.component";
import { AssignUsersComponent } from "./modals/assign-users/assign-users.component";
import { SelectTemplatesComponent } from "./modals/select-templates/select-templates.component";
import { AllFieldsComponent } from "./modals/all-fields/all-fields.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ShotFormComponent } from "./modals/shot-form/shot-form.component";
import { ShotAllFieldsComponent } from "./modals/shot-all-fields/shot-all-fields.component";
import { SharedModule } from "../shared/shared.module";
import { TableColumnsSettingsComponent } from "./modals/table-columns-settings/table-columns-settings.component";
import { TaskFormComponent } from "./modals/task-form/task-form.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { SequenceFormComponent } from "./modals/sequence-form/sequence-form.component";
import { EpisodeFormComponent } from "./modals/episode-form/episode-form.component";
import { SeasonFormComponent } from "./modals/season-form/season-form.component";
import { AssetFormComponent } from "./modals/asset-form/asset-form.component";
import { NewStepFormComponent } from "./modals/new-step-form/new-step-form.component";
import { GroupFormComponent } from "./modals/group-form/group-form.component";
import { GroupAssignUsersComponent } from "./modals/group-assign-users/group-assign-users.component";
import { DepartmentFormComponent } from "./modals/department-form/department-form.component";
import { TasktypeFormComponent } from "./modals/tasktype-form/tasktype-form.component";
import { WorkstatusFormComponent } from "./modals/workstatus-form/workstatus-form.component";
import { PriorityFormComponent } from "./modals/priority-form/priority-form.component";
import { ClientFormComponent } from "./modals/client-form/client-form.component";
import { SpotFormComponent } from "./modals/spot-form/spot-form.component";
import { UserFormComponent } from "./modals/user-form/user-form.component";
import { ShotFilterSettingsComponent } from "./modals/shot-filter-settings/shot-filter-settings.component";
import { ManualInsertionComponent } from "./modals/manual-insertion/manual-insertion.component";
import { ImportCsvComponent } from "./modals/import-csv/import-csv.component";
import { ArtistDbSettingsComponent } from "./modals/artist-db-settings/artist-db-settings.component";
import { StudioDbSettingsComponent } from "./modals/studio-db-settings/studio-db-settings.component";
import { TaskFilterSettingsComponent } from "./modals/task-filter-settings/task-filter-settings.component";
import { TaskLogFormComponent } from "./modals/task-log-form/task-log-form.component";
import { ReportFilterSettingsComponent } from "./modals/report-filter-settings/report-filter-settings.component";
import { UserListFormComponent } from "./modals/user-list-form/user-list-form.component";
import { ReportFormComponent } from "./modals/report-form/report-form.component";
import { ReportInstanceListComponent } from "./modals/report-instance-list/report-instance-list.component";
import { NotificationsComponent } from "./modals/notifications/notifications.component";
import { MyAccountFormComponent } from "./modals/my-account-form/my-account-form.component";
import { NoteFormComponent } from "./modals/note-form/note-form.component";
import { BackupFormComponent } from "./modals/backup-form/backup-form.component";
import { DailiesFilterSettingsComponent } from "./modals/dailies-filter-settings/dailies-filter-settings.component";
import { SharePlaylistComponent } from "./modals/share-playlist/share-playlist.component";
import { HolidayFormComponent } from "./modals/holiday-form/holiday-form.component";
import { LeaveFormComponent } from "./modals/leave-form/leave-form.component";
import { ReviewFormComponent } from "./modals/review-form/review-form.component";
import { CustomFieldFormComponent } from "./modals/custom-field-form/custom-field-form.component";
import { CustomFieldComponent } from "./modals/custom-field/custom-field.component";
import { PlaylistFormComponent } from "./modals/playlist-form/playlist-form.component";
import { IconPickerComponent } from "../shared/components/icon-picker/icon-picker.component";
import { GanttFilterSettingsComponent } from "./modals/gantt-filter-settings/gantt-filter-settings.component";
import { TimeSheetFilterSettingsComponent } from "./modals/time-sheet-filter-settings/time-sheet-filter-settings.component";
import { OfficeLocationFormComponent } from "./modals/office-location-form/office-location-form.component";
import { DaybookFilterComponent } from "./modals/daybook-filter/daybook-filter.component";
import { NotificationSettingsComponent } from './modals/notification-settings/notification-settings.component';
import { ShotAssetStatusFormComponent } from './modals/shot-asset-status-form/shot-asset-status-form.component';
import { AssetFilterSettingsComponent } from './modals/asset-filter-settings/asset-filter-settings.component';
import { TaskFilterComponent } from './modals/task-filter/task-filter.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListingComponent,
    HelpComponent,
    SettingsComponent,
    ShowFormComponent,
    AssignUsersComponent,
    SelectTemplatesComponent,
    AllFieldsComponent,
    ShotFormComponent,
    ShotAllFieldsComponent,
    TableColumnsSettingsComponent,
    TaskFormComponent,
    BreadcrumbComponent,
    SequenceFormComponent,
    EpisodeFormComponent,
    SeasonFormComponent,
    AssetFormComponent,
    NewStepFormComponent,
    GroupFormComponent,
    GroupAssignUsersComponent,
    DepartmentFormComponent,
    TasktypeFormComponent,
    WorkstatusFormComponent,
    PriorityFormComponent,
    ClientFormComponent,
    SpotFormComponent,
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
    DailiesFilterSettingsComponent,
    SharePlaylistComponent,
    HolidayFormComponent,
    LeaveFormComponent,
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
    TaskFilterComponent,
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SharedModule,
    AutonumericModule.forRoot(),
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class SystemModule {}
