import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-note-form",
  templateUrl: "./note-form.component.html",
  styleUrls: ["./note-form.component.scss"]
})
export class NoteFormComponent implements OnInit {
  @Input() itemId: any;
  @Input() type: any;
  constructor() {}

  ngOnInit() {}
}
