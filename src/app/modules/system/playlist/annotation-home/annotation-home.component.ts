import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PlaylistService } from "../playlist.service";

@Component({
  selector: "app-annotation-home",
  templateUrl: "./annotation-home.component.html",
  styleUrls: ["./annotation-home.component.scss"],
})
export class AnnotationHomeComponent implements OnInit {
  playlistId: any;
  rowIndex: any;
  isDataReady: any;
  playlistInfo: any;
  constructor(
    private activatedRouter: ActivatedRoute,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe((params) => {
      this.playlistId = params["playlistId"];
      this.prepareData();
    });
  }

  async prepareData() {
    await this.playlistService
      .getPlaylist(this.playlistId)
      .toPromise()
      .then((resp: any) => {
        this.playlistInfo = resp.entity;
      })
      .catch((error) => {});
    this.isDataReady = true;
  }
}
