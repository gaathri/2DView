import { Component, OnInit } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-favourite-tab",
  templateUrl: "./favourite-tab.component.html",
  styleUrls: ["./favourite-tab.component.scss"],
})
export class FavouriteTabComponent implements OnInit {
  templateListMaster: any;
  templateList: any = [];
  isDataReady: boolean;
  isReadOnly: boolean;
  favoriteSupervisors: any;
  selectedFavorite: any;

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.templateListMaster = [
      {
        label: "Shows",
      },
      {
        label: "Shots",
      },
      {
        label: "Assets",
      },
      {
        label: "Users",
      },
    ];

    for (let i = 0; i < this.templateListMaster.length; i++) {
      let item = this.templateListMaster[i];
      if (this.canAdd(item.label)) {
        this.templateList.push(item);
      }
    }

    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.FAVOURITES
    );
    this.isDataReady = true;
    this.clickHandler(this.templateList[0]);
  }

  canAdd(item: any) {
    let privilegeId = this.helperService.getPrivilegeId();
    let privilegeIdsShotsAssets = [
      AppConstants.HOS_PRIVILEGE_ID,
      AppConstants.PRODUCER_PRIVILEGE_ID,
      AppConstants.SUPERVISOR_PRIVILEGE_ID,
      AppConstants.IO_PRIVILEGE_ID,
    ];
    let privilegeIdsShowsUsers = [AppConstants.ARTIST_PRIVILEGE_ID];
    if (item === "Shots" || item === "Assets") {
      if (privilegeIdsShotsAssets.includes(privilegeId)) {
        return false;
      } else {
        return true;
      }
    }
    if (item === "Shows" || item === "Users") {
      if (privilegeIdsShowsUsers.includes(privilegeId)) {
        return false;
      } else {
        return true;
      }
    }
  }

  clickHandler(item: any) {
    this.selectedFavorite = item.label;
    /*let methodName = "getFavorite" + this.selectedFavorite;
    if (this[methodName]) {
      this[methodName]();
    }*/
  }

  isSelected(item: any) {
    if (item.label === this.selectedFavorite) {
      return true;
    }
    return false;
  }
}
