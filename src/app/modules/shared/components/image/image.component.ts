import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.scss"],
})
export class ImageComponent implements OnInit, OnDestroy {
  @ViewChild("myImage", { static: false }) myImage: any;
  @Input() url: any;
  @Input() isEditable: boolean;
  @Output("edit") onEdit = new EventEmitter<any>();
  loading: boolean = true;
  constructor() {}

  ngOnInit() {
    /*if (environment.production === false) {
      this.url = "";
    }*/
    if (!this.url) {
      this.url = "assets/images/no-image.png";
    }
  }
  onLoad() {
    this.loading = false;
  }

  editHandler() {
    this.onEdit.emit();
  }

  ngOnDestroy(): void {
    if (this.myImage) {
      this.myImage.src = "";
      this.myImage.onload = null;
      this.myImage.onerror = null;
    }
  }

  getImageUrl(entity: any) {
    let _url = this.url;
    return `url(${_url}),url("assets/images/no-image.png")`;
  }
}
