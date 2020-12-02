import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[numeric]",
})
export class NumericDirective {
  @Input("numericType") numericType: string; // number | decimal
  @Input("maxValue") maxValue: any; // number | decimal

  private regex = {
    number: new RegExp(/^\d+$/),
    decimal: new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g),
    //decimal: new RegExp(/^[0-9]*\.?[0-9]*$/g)
  };

  private specialKeys = {
    number: [
      "Delete",
      "Backspace",
      "Tab",
      "End",
      "Home",
      "ArrowLeft",
      "ArrowRight",
    ],
    decimal: [
      "Delete",
      "Backspace",
      "Tab",
      "End",
      "Home",
      "ArrowLeft",
      "ArrowRight",
    ],
  };

  constructor(private el: ElementRef) {}

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys[this.numericType].indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let position: number = this.el.nativeElement.selectionStart;
    let next: string = [
      current.slice(0, position),
      event.key,
      current.slice(position),
    ].join("");
    if (this.numericType === "decimal") {
      let dotIndex = current.indexOf(".");
      if (dotIndex !== -1 && position > dotIndex) {
        if (current.split(".")[1].length > 1) {
          event.preventDefault();
        }
      } else {
      }
    }
    if (next && !String(next).match(this.regex[this.numericType])) {
      event.preventDefault();
    }
    if (this.maxValue) {
      let myval = current ? current : "";
      if (event.key) {
        myval = myval + "" + event.key;
      }

      if (!isNaN(Number(myval))) {
        if (Number(myval) > this.maxValue) {
          event.preventDefault();
        }
      }
      /*if (Number(current) > this.maxValue) {
        event.preventDefault();
      }*/
    }
  }
}
