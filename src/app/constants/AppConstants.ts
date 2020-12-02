export class AppConstants {
  public static DISPLAY_DATE_FORMAT = "dd-MM-yyyy";
  /** Other Constants */
  //public static userNameRE = '^[a-zA-Z0-9]+(?:[_ -]?[a-zA-Z0-9])*$';
  public static userNameRE = "^[a-zA-Z]+(?:[ ]?[a-zA-Z])*$";
  public static itemNameRE = "^[a-zA-Z0-9]+(?:[_.-]?[ a-zA-Z0-9])*$";
  public static folderNameRE = "^[a-zA-Z0-9]+(?:[_ -]?[a-zA-Z0-9])*$";

  public static PRODUCER_ROLE_ID = 4;
  public static SUPERVISOR_ROLE_ID = 5;
  public static ARTIST_ROLE_ID = 6;
  public static CLIENT_ROLE_ID: any = 7;

  public static ADMIN_PRIVILEGE_ID = 1;
  public static IO_PRIVILEGE_ID = 2;
  public static PRODUCER_PRIVILEGE_ID = 3;
  public static SUPERVISOR_PRIVILEGE_ID = 4;
  public static ARTIST_PRIVILEGE_ID = 5;
  public static CLIENT_PRIVILEGE_ID: any = 6;
  public static HR_PRIVILEGE_ID: any = 7;
  public static HOS_PRIVILEGE_ID: any = 8;
  public static CUSTOM_PRIVILEGE_ID: any = 9;

  public static SHOW_TEMPLATES_ID = 1;
  public static SHOT_TEMPLATES_ID = 2;
  public static PACKING_TEMPLATES_ID = 3;
  public static TASK_TEMPLATES_ID = 4;
  public static SUPERVISOR_AVATAR_MAX = 3;
  public static ARTIST_AVATAR_MAX = 5;
  public static NOTIFICATION_DURATION = 4000;
  public static MAX_LENGTH_NAME = 50;
  public static MAX_LENGTH_CODE = 10;
  public static MAX_LENGTH_DESC = 200;
  public static SHOT_MAX_LENGTH_NAME = 100;
  public static WORK_LOG_LIMIT = 30;
  public static WORK_LOG_UNLIMITED = 365;
  public static HOURS_PER_DAY = 8;
  public static EXTRA_HOURS_PER_DAY = 16;
  public static WEEK_ENDS = ["Sunday", "Saturday"];
  public static DAY_INDEX = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  public static MY_STUDIO_ID = 1;
  public static WORK_IN_PROGRESS_CODE = "WIP";
  public static WORK_COMPLETED_CODE = "Completed";
  public static WORK_REVIEW_CODE = "Review";
  public static WORK_NOT_STARTED = "Not Started";
  public static NOTIFICATION_INTERVAL = 60 * 1000;
  public static IMAGE_FILE_ACCEPT_LIST =
    "image/png, image/jpg, image/jpeg, image/tif, image/tiff, image/exr, image/dpx, image/x-dpx, image/x-exr;version='2'";
  public static FAV_ICON_ACCEPT_LIST = "image/png";

  //https://www.digipres.org/formats/mime-types/
  //"'image/png, image/jpg, image/jpeg, image/tif, image/tiff, image/exr, image/dpx'";
  public static PAGING_USER_SETTINGS_ID = null;
  public static SHOT_USER_SETTINGS_ID = null;
  public static ASSET_USER_SETTINGS_ID = null;
  public static TASK_USER_SETTINGS_ID = null;
  public static DAYBOOK_USER_SETTINGS_ID = null;
  public static STUDIO_DASHBOARD_USER_SETTINGS_ID = null;
  public static ARTIST_DASHBOARD_USER_SETTINGS_ID = null;
  public static KANBAN_USER_SETTINGS_ID = null;

  public static CONFIG_MENU = [
    "Role",
    "User",
    "Group",
    "Department",
    "Task Type",
    "Work Status",
    "Priority",
    "Client",
    "Template",
    "Custom Fields",
    "Office Location",
    "Shot/Asset Status",
  ];

  public static SHOT_STATUS_CODES = {
    Offline: "#ffc044",
    Online: "#25d1df",
    Omit: "#ef5350",
    "On hold": "#ff902b",
    "Not Started": "#f86292",
    WIP: "#00b1fb",
    Approved: "#00c293",
  };

  public static PERMISSIONS = {
    ROLE: "Role",
    USER: "User",
    GROUP: "Group",
    DEPARTMENT: "Department",
    TASK_TYPE: "Task Type",
    WORK_STATUS: "Work Status",
    STATUS: "Shot/Asset Status",
    PRIORITY: "Priority",
    CLIENT: "Client",
    CUSTOM_FIELDS: "Custom Fields",
    OFFICE_LOCATION: "Office Location",
    TEMPLATE: "Template",
    SHOW: "Show",
    SEASON: "Season",
    EPISODE: "Episode",
    SEQUENCE: "Sequence",
    SPOT: "Spot",
    SHOT: "Shot",
    ASSET: "Asset",
    TASK: "Task",
    PUBLISHING: "Publishing",
    SCREENING: "Screening",
    PACKING: "Packing",
    BACKUP: "Backup",
    PLAYLIST: "Playlist",
    MY_TASK: "My Task",
    LEAVE_MANAGEMENT: "Leave Management",
    TIME_SHEET: "Time Sheet",
    TIME_SHEET_REVIEW: "Time Sheet Review",
    FAVOURITES: "Favourites",
    DAYBOOK: "Daybook",
  };

  public static PROGRESS_CONFIG = {
    showInfo: true,
    type: "circle",
    strokeLinecap: "round",
    strokeWidth: 8,
    strokeColor: "#3be582",
  };

  public static ROLES = {
    ARTIST: "Artist",
    SUPERVISOR: "Supervisors",
    ADMIN: "Admin",
  };

  public static PLAYLIST_STATUS_LIST = [
    "ALL",
    "PENDING",
    "APPROVED",
    "REJECTED",
  ];
  public static COLOR_PALETTE_CODES = [
    "#65CCAF",
    "#44C8D7",
    "#A88AE6",
    "#FF5C9A",
    "#FF643D",
    "#FFA126",
    "#F8C41B",
    "#5FE380",
    "#27C5F5",
    "#409FFF",
    "#8483E6",
    "#FF7E7E",
    "#BA9A8C",
    "#C69F4C",
    "#FF8B3D",
    "#71C246",
    "#859BFF",
    "#DE8AE6",
    "#FF867D",
    "#D9BA77",
    "#DE2E21",
    "#FF8B3D",
    "#569733",
    "#4B5EB3",
    "#97499E",
    "#DE2E21",
  ];

  public static TABLE_PAGE_SIZE_OPTIONS = [10, 50, 100, 200];
  public static PAGE_SIZE = 10;
  public static REPORT_CUSTOM_RANGE_ID = 5;

  public static STUDIO_REPORT_ID = 1;
  public static PROJECT_REPORT_ID = 2;
  public static DEPARTMENT_REPORT_ID = 3;
  public static DAYBOOK_REPORT_ID = 4;
  public static IN_PROGRESS_REPORT_ID = 5;
  public static INDIVIDUAL_ARTIST_REPORT_ID = 6;
  public static FINANCIAL_REPORT_ID = 7;
  public static ARTIST_AVAILABILITY_REPORT_ID = 8;
  public static SHOW_FILTER_REPORT_IDS = [
    AppConstants.STUDIO_REPORT_ID,
    AppConstants.DAYBOOK_REPORT_ID,
    AppConstants.IN_PROGRESS_REPORT_ID,
  ];
  public static DEPARTMENT_FILTER_REPORT_IDS = [
    AppConstants.DEPARTMENT_REPORT_ID,
    AppConstants.ARTIST_AVAILABILITY_REPORT_ID,
  ];

  /** END Points */
  public static ACCOUNT_LOGIN = "session/login";
  public static ACTION_LIST = "action";
  public static REPORT_LIST = "reportType";
  public static ROLE_LIST = "role/list";
  public static ROLE = "role";

  public static FAVORITE = "favorite";
  public static REMOVE_FAVORITE = "favorite/remove";

  public static SHOW = "show";
  public static SHOW_LIST = AppConstants.SHOW + "/list-search?search=";
  public static SHOWS = AppConstants.SHOW + "/list";
  public static ARIST_SHOWS = AppConstants.SHOW + "/list-by-arist";
  public static CLIENT_SHOWS = AppConstants.SHOW + "/list-by-client";
  public static SHOW_STATUS = AppConstants.SHOW + "/status";
  public static SHOW_INFO = AppConstants.SHOW + "/info";
  public static SHOW_LIST_SUPERVISORS = AppConstants.SHOW + "/list-supervisors";
  public static SHOW_LIST_TASK_TYPES = AppConstants.SHOW + "/list-task-types";
  public static SHOW_ARTIST_LIST = AppConstants.SHOW + "/list-members";

  public static SHOT = "shot";
  public static SHOT_LIST = AppConstants.SHOT + "/list";
  public static MANUAL_INSERTION = AppConstants.SHOT + "/manual-ingestion";
  public static SHOT_STATUS = AppConstants.SHOT + "/status";
  public static SHOT_INFO = AppConstants.SHOT + "/info";
  public static SHOT_COLUMN_LIST = "columnsettings/list/Shot";
  public static ASSET_COLUMN_LIST = "columnsettings/list/Asset";
  public static DAYBOOK_COLUMN_LIST = "columnsettings/list/Daybook";

  public static SHOT_INLINE_EDIT = AppConstants.SHOT + "/inline-edit";
  public static SHOT_ALL_STATUS = AppConstants.SHOT + "/allstatus";

  public static TASK = "task";
  public static TASK_LIST_FILTER = "task/list/filter1";
  public static TASK_COLUMN_LIST = "columnsettings/list/Task";
  public static MY_TASK = "task/my-task";
  public static TASK_LIST_FILTER_NEW = "task/list/filter";

  public static TASK_INLINE_EDIT = "task/inline-edit";
  public static TASK_MULTIPLE_EDIT = "task/multiple-field-edit";
  public static TASK_LIST_ASSET_FILTER = "task/list/asset-filter";
  public static TASK_BY_ARTIST = "task/list/task-by-artist";
  public static TASK_LIST_VIEW = "task/list/view";

  public static TASK_PROGRESS_SHOT = "task/progress/shot?shotIds=";
  public static TASK_PROGRESS_ASSET = "task/progress/asset?assetIds=";
  public static TASK_PROGRESS_TASK = "task/progress/task?taskIds=";
  public static TASK_VERSIONS = "task/versions";

  public static PLAYLIST = "playlist";
  public static PLAYLIST_DAILIES = "playlist/list/DAILIES";
  public static PLAYLIST_INTERNAL = "playlist/list/INTERNAL";
  public static PLAYLIST_EXTERNAL = "playlist/list/EXTERNAL";
  public static PLAYLIST_ARCHIVE = "playlist/list/ARCHIVE";

  public static PLAYLIST_TYPE = {
    DAILIES: "DAILIES",
    INTERNAL: "INTERNAL",
    EXTERNAL: "EXTERNAL",
    ARCHIVE: "ARCHIVE",
  };

  public static NOTES = "notes";
  public static FEEDBACK = "feedback";

  public static GROUP = "group";
  public static GROUP_SEARCH = "group/list";
  public static GROUP_INLINE_EDIT = "";
  public static GROUP_LIST = "group/list-tree";

  public static DEPARTMENT = "department";
  public static DEPARTMENT_SEARCH = "department/list";
  public static DEPARTMENT_INLINE_EDIT = "";
  public static DEPARTMENT_LIST = "department/list-tree";
  public static DEPARTMENT_LIST_SEARCH = "department/list-search";

  public static TASKTYPE = "task-type";
  public static TASKTYPE_SEARCH = "task-type/list";
  public static TASKTYPE_INLINE_EDIT = "";
  public static TASKTYPE_LIST = "task-type/list-tree";

  public static WORKSTATUS = "workstatus";
  public static WORKSTATUS_SEARCH = "workstatus/list";
  public static WORKSTATUS_LIST = "workstatus/list-tree";

  public static STATUS = "status";
  public static STATUS_SEARCH = "status/list";
  public static STATUS_LIST = "status/list-tree";

  public static TASK_PRIORITIES = "taskpriority";
  public static PRIORITY = "taskpriority";
  public static PRIORITY_SEARCH = "taskpriority/list";
  public static PRIORITY_LIST = "taskpriority/list-tree";

  public static CLIENT = "client";
  public static CLIENT_SEARCH = "client/list";
  public static CLIENT_LIST = "client/list-tree";
  public static CLIENT_ACTIVE = "client/list-active";

  public static OFFICE_LOCATION = "location";
  public static OFFICE_LOCATION_LIST = "location/list";

  public static CUSTOM_FIELD = "customfield";
  public static CUSTOM_FIELD_LIST = AppConstants.CUSTOM_FIELD + "/list";

  public static USER = "users";
  public static USER_LIST = "users/list-tree";
  public static USER_SEARCH = "users/list";
  public static USER_LIST_BY_ROLE = "users/list-by-role";
  public static USER_LIST_BY_PRIVILEGE = "users/list-by-privilege";
  public static SUPERVISOR_LIST =
    "users/list-tree?roleId=" + AppConstants.SUPERVISOR_ROLE_ID;

  public static PRODUCER_LIST =
    "users/list-tree?roleId=" + AppConstants.PRODUCER_ROLE_ID;

  public static EPISODE = "episode";
  public static EPISODE_LIST = "episode/list";
  public static EPISODE_SEARCH = "episode/list-search";
  public static EPISODE_INLINE_EDIT = "episode/inline-edit";

  public static SEQUENCE = "sequence";
  public static SEQUENCE_LIST = "sequence/list";
  public static SEQUENCE_SEARCH = "sequence/list-search";
  public static SEQUENCE_INLINE_EDIT = "sequence/inline-edit";

  public static SEASON = "season";
  public static SEASON_LIST = "season/list";
  public static SEASON_SEARCH = "season/list-search";
  public static SEASON_INLINE_EDIT = "season/inline-edit";

  public static SPOT = "spot";
  public static SPOT_LIST = "spot/list";
  public static SPOT_SEARCH = "spot/list-search";
  public static SPOT_INLINE_EDIT = "spot/inline-edit";

  public static ASSET = "asset";
  public static ASSET_LIST = "asset/list";
  public static ASSET_TYPES = "assetType";
  public static ASSET_INLINE_EDIT = "asset/inline-edit";
  public static ASSET_INFO = "asset/info";
  public static ASSET_STATUS = "asset/status";

  public static NOTE = "spot";
  public static NOTE_LIST = "spot/list";
  public static NOTE_SEARCH = "spot/list-search";

  public static SHOW_TEMPLATES =
    "template/type/tree/" + AppConstants.SHOW_TEMPLATES_ID;
  public static SHOT_TEMPLATES =
    "template/type/tree/" + AppConstants.SHOT_TEMPLATES_ID;
  public static PACKING_TEMPLATES =
    "template/type/tree/" + AppConstants.PACKING_TEMPLATES_ID;
  public static TASK_TEMPLATES =
    "template/type/tree/" + AppConstants.TASK_TEMPLATES_ID;

  public static TEMPLATE = "template";
  public static TEMPLATE_LIST = "template/type";
  public static TASK_TEMPLATE_INFO = "taskTypeSequence/list";
  public static ADD_TASK_TYPE_SEQUENCE = "taskTypeSequence/add";
  public static TASK_TYPE_SEQUENCE = "taskTypeSequence";
  public static INLINE_EDIT_TASK_TYPE_SEQUENCE = "taskTypeSequence/inline-edit";
  public static PACKING_TYPES = "packingType";
  public static PACKING_ATTRIBUTES = "packingAttribute";

  public static SHOT_ATTRIBUTES = "shotAttributes/list-tree";

  public static UPLOAD_FILE = "upload-file";
  public static UPLOAD_FAV_ICON = "upload-favicon";

  public static UPLOAD_CSV_FILE = "csv/upload";
  public static CSV_HEADERS = "csv/headers";
  public static CSV_VALIDATOR = "csv/validator";

  public static CONFIG = "config";
  public static SETTINGS = "settings";
  public static SETTINGS_ADD = AppConstants.SETTINGS + "/add";

  /** Artist Dashboard End Points - START */

  public static ARTIST_ACTIVITY_LOGS = "artist-dashboard/activitylogs";
  public static ARTIST_OVERALL_TASK_PROGRESS =
    "artist-dashboard/overall-task-progress";
  public static ARTIST_STORAGE_SPACE = "artist-dashboard/storage-space";
  public static ARTIST_TASK_PROGRESS_BY_SHOT =
    "artist-dashboard/task-progress-by-shot";

  public static ARTIST_STAR_SHOTS = "shot/star";
  public static ARTIST_FAVORITE_SHOTS = "shot/favorites";
  public static ARTIST_SHOT_ADD_STAR = "favorite/star/Shot";
  public static ARTIST_SHOT_REMOVE_STAR = "favorite/remove/Shot";

  /** Artist Dashboard End Points - END*/
  /** Studio Dashboard End Points - START */
  public static STUDIO = "studio";
  public static STUDIO_MANPOWER = "studio-dashboard/manpower";
  public static STUDIO_ARTIST_AVAILABILITY =
    "studio-dashboard/artist-availability";
  public static STUDIO_ACTIVITY_LOGS = "studio-dashboard/activitylogs";
  public static STUDIO_OVERALL_SHOT_PROGRESS =
    "studio-dashboard/overall-shot-progress";

  public static STUDIO_OVERALL_ASSET_PROGRESS =
    "studio-dashboard/overall-asset-progress";

  public static STUDIO_OVERALL_TASK_PROGRESS =
    "studio-dashboard/overall-task-progress";

  public static STUDIO_SHOT_PROGRESS_BY_SHOW =
    "studio-dashboard/show-shot-progress";
  public static STUDIO_SHOT_PROGRESS_BY_SUPERVISOR =
    "studio-dashboard/supervisor";
  public static STUDIO_STAR_SHOWS = "show/star";
  public static STUDIO_STAR_SUPERVISORS = "users/star";
  public static STUDIO_FAVORITE_SHOWS = "show/favorites";
  public static STUDIO_FAVORITE_SUPERVISORS = "users/favorite";
  public static STUDIO_SHOW_ADD_STAR = "favorite/star/Show";
  public static STUDIO_SUPERVISOR_ADD_STAR = "favorite/star/User";
  public static STUDIO_SHOW_REMOVE_STAR = "favorite/remove/star/Show";
  public static STUDIO_SUPERVISOR_REMOVE_STAR = "favorite/remove/star/User";

  public static DAYBOOK_SHOT_VIEW = "daybook-report/SHOT_VIEW";
  public static DAYBOOK_ASSET_VIEW = "daybook-report/ASSET_VIEW";
  /** Studio Dashboard End Points - END */

  /** Artist Time Sheet End Points - START */
  public static WORK_LOG = "worklog";
  public static WORK_LOG_LIST = "worklog/list";
  public static MY_WORK_LOGS = "worklog/mylogs";
  public static TIME_SHEET = "worklog/timesheet";
  /** Artist Time Sheet End Points - END */

  /** Reports End Points - START */
  public static REPORT_TYPE_LIST = "reportType/list";
  public static REPORT_DATE_RANGE = "report/daterange";
  public static REPORT_KPI = "report/kpi";
  public static REPORT_DATA = "report/data";
  public static REPORT_TEMPLATE = "reporttemplate";
  public static REPORT_INSTANCE = "reportinstance";

  /** Reports End Points - END */

  public static NOTIFICATION_LIST = "notification/list";
  public static NOTIFICATION_READ = "notification/read";
  public static NOTIFICATION_LATEST = "notification/latest";

  /** Holiday End Points - END */
  public static HOLIDAY = "holiday";
  public static HOLIDAY_LIST = AppConstants.HOLIDAY + "/list";
  public static HOLIDAY_KPI = AppConstants.HOLIDAY + "/info";
  /** Holiday End Points - END */

  /** Leave End Points - END */
  public static LEAVE = "leave";
  public static LEAVE_LIST = AppConstants.LEAVE + "/list";
  public static LEAVE_INFO = AppConstants.LEAVE + "/info";
  public static WEEKEND_INFO = AppConstants.LEAVE + "/weekends";
  /** Leave End Points - END */

  /** Notification Messages */
  public static EXIT_WARNING_MESSAGE = "Are you sure you want to leave?";
  public static ROLE_CREATION_SUCCESS = "Role has been successfully created.";
  public static ROLE_CREATION_ERROR = "Role creation failed.";
  public static ROLE_MODIFICATION_SUCCESS =
    "Role has been successfully updated.";
  public static ROLE_MODIFICATION_ERROR = "Role updation failed.";

  public static SHOW_CREATION_SUCCESS = "Show has been successfully created.";
  public static SHOW_CREATION_ERROR = "Show creation failed.";

  public static SHOW_LIKE_SUCCESS =
    "Show has been successfully added to favorite list.";
  public static SHOW_LIKE_ERROR = "Show addtion to favorite list failed.";
  public static SHOW_DISLIKE_SUCCESS =
    "Show has been successfully removed from favorite list.";
  public static SHOW_DISLIKE_ERROR = "Show removal from favorite list failed.";

  public static USER_LIKE_SUCCESS =
    "User has been successfully added to favorite list.";
  public static USER_LIKE_ERROR = "User addtion to favorite list failed.";
  public static USER_DISLIKE_SUCCESS =
    "User has been successfully removed from favorite list.";
  public static USER_DISLIKE_ERROR = "User removal from favorite list failed.";

  public static SHOT_LIKE_SUCCESS =
    "Shot has been successfully added to favorite list.";
  public static SHOT_LIKE_ERROR = "Shot addtion to favorite list failed.";
  public static SHOT_DISLIKE_SUCCESS =
    "Shot has been successfully removed from favorite list.";
  public static SHOT_DISLIKE_ERROR = "Shot removal from favorite list failed.";

  public static ASSET_LIKE_SUCCESS =
    "Asset has been successfully added to favorite list.";
  public static ASSET_LIKE_ERROR = "Asset addtion to favorite list failed.";
  public static ASSET_DISLIKE_SUCCESS =
    "Asset has been successfully removed from favorite list.";
  public static ASSET_DISLIKE_ERROR =
    "Asset removal from favorite list failed.";

  public static SHOW_MODIFICATION_SUCCESS =
    "Show has been successfully updated.";
  public static SHOW_MODIFICATION_ERROR = "Show updation failed.";

  public static SHOT_CREATION_SUCCESS = "Shot has been successfully created.";
  public static SHOT_CREATION_ERROR = "Shot creation failed.";
  public static SHOT_CSV_IMPORT_SUCCESS =
    "Shots have been successfully imported.";
  public static SHOT_CSV_IMPORT_ERROR = "Shots creation failed.";

  public static MI_SHOT_CREATION_SUCCESS =
    "Shots have been successfully created via Manual Ingestion.";
  public static MI_SHOT_CREATION_ERROR = "Shot manual ingestion failed.";

  public static SHOT_MODIFICATION_SUCCESS =
    "Shot has been successfully updated.";
  public static SHOT_MODIFICATION_ERROR = "Shot updation failed.";

  public static TASK_CREATION_SUCCESS = "Task has been successfully created.";
  public static TASK_CREATION_ERROR = "Task creation failed.";
  public static TASK_MODIFICATION_SUCCESS =
    "Task has been successfully updated.";
  public static TASK_MODIFICATION_ERROR = "Task updation failed.";

  public static SEQUENCE_CREATION_SUCCESS =
    "Sequence has been successfully created.";
  public static SEQUENCE_CREATION_ERROR = "Sequence creation failed.";
  public static SEQUENCE_MODIFICATION_SUCCESS =
    "Sequence has been successfully updated.";
  public static SEQUENCE_MODIFICATION_ERROR = "Sequence updation failed.";

  public static SEASON_CREATION_SUCCESS =
    "Season has been successfully created.";
  public static SEASON_CREATION_ERROR = "Season creation failed.";
  public static SEASON_MODIFICATION_SUCCESS =
    "Season has been successfully updated.";
  public static SEASON_MODIFICATION_ERROR = "Season updation failed.";

  public static SPOT_CREATION_SUCCESS = "Spot has been successfully created.";
  public static SPOT_CREATION_ERROR = "Spot creation failed.";
  public static SPOT_MODIFICATION_SUCCESS =
    "Spot has been successfully updated.";
  public static SPOT_MODIFICATION_ERROR = "Spot updation failed.";

  public static EPISODE_CREATION_SUCCESS =
    "Episode has been successfully created.";
  public static EPISODE_CREATION_ERROR = "Episode creation failed.";
  public static EPISODE_MODIFICATION_SUCCESS =
    "Episode has been successfully updated.";
  public static EPISODE_MODIFICATION_ERROR = "Episode updation failed.";

  public static ASSET_CREATION_SUCCESS = "Asset has been successfully created.";
  public static ASSET_CREATION_ERROR = "Asset creation failed.";
  public static ASSET_MODIFICATION_SUCCESS =
    "Asset has been successfully updated.";
  public static ASSET_MODIFICATION_ERROR = "Asset updation failed.";
  public static TASK_TEMPLATE_ITEM_ADD_SUCCESS = "Item(s) added successfully";
  public static TASK_TEMPLATE_ITEM_ADD_ERROR = "Item(s) addtion failed.";

  public static TEMPLATE_MODIFICATION_SUCCESS =
    "Template has been successfully updated.";
  public static TEMPLATE_MODIFICATION_ERROR = "Template updation failed.";

  public static GROUP_CREATION_SUCCESS = "Group has been successfully created.";
  public static GROUP_CREATION_ERROR = "Group creation failed.";
  public static GROUP_MODIFICATION_SUCCESS =
    "Group has been successfully updated.";
  public static GROUP_MODIFICATION_ERROR = "Group updation failed.";

  public static DEPARTMENT_CREATION_SUCCESS =
    "Department has been successfully created.";
  public static DEPARTMENT_CREATION_ERROR = "Department creation failed.";
  public static DEPARTMENT_MODIFICATION_SUCCESS =
    "Department has been successfully updated.";
  public static DEPARTMENT_MODIFICATION_ERROR = "Department updation failed.";

  public static TASKTYPE_CREATION_SUCCESS =
    "Task Type has been successfully created.";
  public static TASKTYPE_CREATION_ERROR = "Task Type creation failed.";
  public static TASKTYPE_MODIFICATION_SUCCESS =
    "Task Type has been successfully updated.";
  public static TASKTYPE_MODIFICATION_ERROR = "Task Type updation failed.";

  public static WORKSTATUS_CREATION_SUCCESS =
    "Work Status has been successfully created.";
  public static WORKSTATUS_CREATION_ERROR = "Work Status creation failed.";
  public static WORKSTATUS_MODIFICATION_SUCCESS =
    "Work Status has been successfully updated.";
  public static WORKSTATUS_MODIFICATION_ERROR = "Work Status updation failed.";

  public static STATUS_CREATION_SUCCESS =
    " Status has been successfully created.";
  public static STATUS_CREATION_ERROR = " Status creation failed.";
  public static STATUS_MODIFICATION_SUCCESS =
    " Status has been successfully updated.";
  public static STATUS_MODIFICATION_ERROR = " Status updation failed.";

  public static CLIENT_CREATION_SUCCESS =
    "Client has been successfully created.";
  public static CLIENT_CREATION_ERROR = "Client creation failed.";
  public static CLIENT_MODIFICATION_SUCCESS =
    "Client has been successfully updated.";
  public static CLIENT_MODIFICATION_ERROR = "Client updation failed.";

  public static OFFICE_LOCATION_CREATION_SUCCESS =
    "Office location has been successfully created.";
  public static OFFICE_LOCATION_CREATION_ERROR =
    "Office location creation failed.";
  public static OFFICE_LOCATION_MODIFICATION_SUCCESS =
    "Office location has been successfully updated.";
  public static OFFICE_LOCATION_MODIFICATION_ERROR =
    "Office location updation failed.";

  public static PRIORITY_CREATION_SUCCESS =
    "Task Priority has been successfully created.";
  public static PRIORITY_CREATION_ERROR = "Task Priority creation failed.";
  public static PRIORITY_MODIFICATION_SUCCESS =
    "Task Priority has been successfully updated.";
  public static PRIORITY_MODIFICATION_ERROR = "Task Priority updation failed.";

  public static IMAGE_UPLOAD_ERROR = "Image upload failed.";

  public static USER_CREATION_SUCCESS = "User has been successfully created.";
  public static USER_CREATION_ERROR = "User creation failed.";
  public static USER_MODIFICATION_SUCCESS =
    "User has been successfully updated.";
  public static USER_MODIFICATION_ERROR = "User updation failed.";

  public static WORK_LOG_CREATION_SUCCESS =
    "Work log has been successfully created.";
  public static WORK_LOG_CREATION_ERROR = "Work log creation failed.";
  public static WORK_LOG_MODIFICATION_SUCCESS =
    "Work log has been successfully updated.";
  public static WORK_LOG_MODIFICATION_ERROR = "Work log updation failed.";

  public static STUDIO_MODIFICATION_SUCCESS =
    "Studio details have been successfully updated.";
  public static STUDIO_MODIFICATION_ERROR = "Studio details updation failed.";

  public static REPORT_TEMPLATE_CREATION_SUCCESS =
    "Report template has been successfully created.";
  public static REPORT_TEMPLATE_CREATION_ERROR =
    "Report template creation failed.";
  public static REPORT_TEMPLATE_MODIFICATION_SUCCESS =
    "Report template has been successfully updated.";
  public static REPORT_TEMPLATE_MODIFICATION_ERROR =
    "Report template updation failed.";

  public static SEND_PLAYLIST_SUCCESS = "Playlist has been successfully sent.";
  public static SEND_PLAYLIST_ERROR = "Send playlist operation failed.";

  public static SHARE_PLAYLIST_SUCCESS =
    "Playlist has been successfully shared.";
  public static SHARE_PLAYLIST_ERROR = "Share playlist operation failed.";

  public static APPROVE_PLAYLIST_SUCCESS =
    "Version has been successfully approved.";
  public static APPROVE_PLAYLIST_ERROR = "Approve version operation failed.";

  public static REJECT_PLAYLIST_SUCCESS =
    "Version has been successfully rejected.";
  public static REJECT_PLAYLIST_ERROR = "Reject version operation failed.";

  public static HOLIDAY_CREATION_SUCCESS =
    "Holiday has been successfully created.";
  public static HOLIDAY_CREATION_ERROR = "Holiday creation failed.";
  public static HOLIDAY_MODIFICATION_SUCCESS =
    "Holiday has been successfully updated.";
  public static HOLIDAY_MODIFICATION_ERROR = "Holiday updation failed.";

  public static LEAVE_CREATION_SUCCESS = "Leave has been successfully created.";
  public static LEAVE_CREATION_ERROR = "Leave creation failed.";
  public static LEAVE_MODIFICATION_SUCCESS =
    "Leave has been successfully updated.";
  public static LEAVE_MODIFICATION_ERROR = "Leave updation failed.";

  public static BACKUP_CREATION_SUCCESS =
    "Backup has been successfully created.";
  public static BACKUP_CREATION_ERROR = "Backup creation failed.";

  public static CUSTOM_FIELD_CREATION_SUCCESS =
    "Custom field has been successfully created.";
  public static CUSTOM_FIELD_CREATION_ERROR = "Custom field creation failed.";

  public static CUSTOM_FIELD_MODIFICATION_SUCCESS =
    "Custom field has been successfully updated.";
  public static CUSTOM_FIELD_MODIFICATION_ERROR =
    "Custom field updation failed.";

  public static PLAYLIST_CREATION_SUCCESS =
    "Playlist has been successfully created.";
  public static PLAYLIST_CREATION_ERROR = "Playlist creation failed.";
  public static PLAYLIST_MODIFICATION_SUCCESS =
    "Playlist has been successfully updated.";
  public static PLAYLIST_MODIFICATION_ERROR = "Playlist updation failed.";

  /** Login Error Messages */
  public static LOGIN_ERROR = "Username or Password Invalid.";
  public static LOGIN_FAILED = "Invalid Username and/or Password.";
  public static MANDATORY_ERROR =
    "All fields marked with an asterisk (*) are mandatory";
  public static PATTERN_ERROR = "Invalid input.";

  public static TASK_ENTITY_ID = 6;
  public static REVISION_ENTITY_ID = 9;
}
