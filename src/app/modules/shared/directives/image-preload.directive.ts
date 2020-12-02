import { Directive, Input, HostBinding, Output } from "@angular/core";
@Directive({
  selector: "img[default]",
  host: {
    "(error)": "updateUrl()",
    "(load)": "load()",
    "[src]": "src",
  },
})
export class ImagePreloadDirective {
  @Input() src: string;
  @Input() default: string;
  @HostBinding("class") className;
  constructor() {
    this.className = "image-loading";
  }
  updateUrl() {
    this.src = "assets/images/no-image.png";
  }
  load() {
    this.className = "image-loaded";
  }
}
