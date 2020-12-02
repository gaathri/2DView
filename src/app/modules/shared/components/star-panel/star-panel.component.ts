import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-star-panel",
  templateUrl: "./star-panel.component.html",
  styleUrls: ["./star-panel.component.scss"],
})
export class StarPanelComponent implements OnInit {
  @Input() starEntities: any;
  @Output("add") addEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output("select") selectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output("close") closeEvent: EventEmitter<any> = new EventEmitter<any>();

  title: any;
  maxStarItems = 6;
  starItemsLength = 0;
  starItems: any;
  selectedId: any;

  constructor() {}

  ngOnInit() {
    if (this.starEntities && this.starEntities.items) {
      this.selectHandler("", this.starEntities.items[0]);
    }
  }

  getStarItems() {
    if (this.starEntities) {
      this.title = this.starEntities.title;
      console.log(this.starEntities);
      if (
        this.starEntities &&
        this.starEntities.items &&
        this.starEntities.items.length > 0
      ) {
        this.starItems = this.starEntities.items;
        this.starItemsLength =
          this.starItems.length <= this.maxStarItems
            ? this.starItems.length
            : this.maxStarItems;
        return this.starItems;
      }
    }
    return null;
  }
  addHandler(event: any) {
    this.addEvent.emit();
  }

  selectHandler(event: any, entity: any) {
    if (entity) {
      this.selectedId = entity.id;
      this.selectEvent.emit(entity);
    }
  }

  closeHandler(event: any, entity: any) {
    this.closeEvent.emit(entity);
  }

  getImageUrl(entity: any) {
    let _url = entity && entity.thumbnail ? entity.thumbnail : "";
    return `url("${_url}"),url("assets/images/no-image.png")`;
  }

  isActive(entity: any) {
    if (this.selectedId === entity.id) {
      return true;
    }
    return false;
  }
}
