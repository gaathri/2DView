import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-card-view",
  templateUrl: "./card-view.component.html",
  styleUrls: ["./card-view.component.scss"],
})
export class CardViewComponent implements OnInit {
  @Input() data: any;
  @Input() isReadOnly: boolean;
  @Input() type: any;

  @Output("edit") onEdit = new EventEmitter<any>();
  @Output("like") onLike = new EventEmitter<any>();
  @Output("backup") onBackup = new EventEmitter<any>();
  @Output("delete") onDelete = new EventEmitter<any>();

  constructor(private helperService: HelperService) {}

  ngOnInit() {}

  editHandler() {
    this.onEdit.emit();
  }

  getValue(value: any) {
    if (value) {
      return value;
    }
    return " - ";
  }

  getTitle(value: any) {
    if (value) {
      return value;
    }
    return "";
  }

  getIconType() {
    return "star";
  }

  getIconTheme() {
    let isFavorite = false;
    if (this.data.isFavorite) {
      isFavorite = true;
    }
    return isFavorite ? "fill" : "outline";
  }

  likeHandler() {
    this.onLike.emit();
  }

  backupHandler() {
    this.onBackup.emit();
  }

  deleteHandler() {
    this.onDelete.emit();
  }

  showLikeIcon() {
    return false;
    let show = false;
    if (this.data.hasOwnProperty("isFavorite")) {
      show = true;
    }
    return show;
  }

  showEditMenu() {
    if (this.isReadOnly) {
      return false;
    }
    return true;
  }

  showBackupMenu() {
    if (this.type && this.type === "show") {
      return true;
    }
    return false;
  }

  showDeleteMenu() {
    if (this.isReadOnly) {
      return false;
    }
    if (this.type && this.type === "show") {
      return true;
    }
    return false;
  }
}
