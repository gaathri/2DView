import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { NzDividerModule } from "ng-zorro-antd/divider";
@Component({
  selector: "app-user-list-by-role",
  templateUrl: "./user-list-by-role.component.html",
  styleUrls: ["./user-list-by-role.component.scss"]
})
export class UserListByRoleComponent implements OnInit {
  @Input() userInfo: any;
  @Input() userDetails: any;
  @Input() isReadOnly: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  deleteTemplateHandler(role: any, user: any) {
    this.event.emit({ role, user });
  }

  getAvatarInfo(item: any) {
    return {
      firstName: item.firstName,
      lastName: item.lastName,
      thumbnail: item.thumbnail
    };
  }
}
