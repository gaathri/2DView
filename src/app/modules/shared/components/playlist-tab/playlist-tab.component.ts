import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Role } from "../../model/role";

@Component({
  selector: "app-playlist-tab",
  templateUrl: "./playlist-tab.component.html",
  styleUrls: ["./playlist-tab.component.scss"],
})
export class PlaylistTabComponent implements OnInit {
  tabs: any;
  myTabs: any;
  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.prepareData();
  }
  prepareData() {
    let showDailies = false;
    let showInternal = false;
    let privilegeId = this.helperService.getPrivilegeId();
    if (
      privilegeId !== AppConstants.ARTIST_PRIVILEGE_ID &&
      privilegeId !== AppConstants.CLIENT_PRIVILEGE_ID
    ) {
      showDailies = true;
    }

    if (privilegeId !== AppConstants.CLIENT_PRIVILEGE_ID) {
      showInternal = true;
    }

    this.tabs = [
      {
        id: "dailies",
        title: "Dailies",
        playlistType: AppConstants.PLAYLIST_TYPE.DAILIES,
        show: showDailies,
      },
      {
        id: "internal",
        title: "Internal",
        playlistType: AppConstants.PLAYLIST_TYPE.INTERNAL,
        show: showInternal,
      },
      {
        id: "external",
        title: "External",
        playlistType: AppConstants.PLAYLIST_TYPE.EXTERNAL,
        show: true,
      },
      {
        id: "archive",
        title: "Archive",
        playlistType: AppConstants.PLAYLIST_TYPE.ARCHIVE,
        show: true,
      },
    ];

    this.myTabs = this.tabs.filter((item: any) => item.show);

    // this.myTabs = this.tabs.filter((item) => {
    //   return item.show;
    // });
  }
}
