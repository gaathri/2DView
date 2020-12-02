import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-star-details',
  templateUrl: './star-details.component.html',
  styleUrls: ['./star-details.component.scss']
})
export class StarDetailsComponent implements OnInit {

  @Input() progressEntities: any;
  constructor() { }

  ngOnInit() {
  }

  getName(item: any) {
    return item && item.name ? item.name : "";
  }

  getValue(item: any) {
    return item && item.value ? item.value : 0;
  }

  getPercent(item: any) {
    return item && item.per ? Math.round(item.per) : 0;
  }

  getColor(item: any) {
    return item && item.code ? item.code : "#fff";
  }

  getProgressConfig(item: any) {
    return {
      showInfo: false,
      type: "line",
      strokeLinecap: "round",
      strokeWidth: 8,
      strokeColor: this.getColor(item)
    };
  }
  getActiveShows(progressEntities: any) {
    return (progressEntities && progressEntities.activeShows) ? progressEntities.activeShows : 0;
  }

  getHandlingArtist(progressEntities: any) {
    return (progressEntities && progressEntities.handlingArtist) ? progressEntities.handlingArtist : 0;
  }

  isCountsAvailable(progressEntities: any) {
    let countsAvailable = false;
    if (progressEntities && (progressEntities.hasOwnProperty('activeShows') || progressEntities.hasOwnProperty('handlingArtist'))) {
      countsAvailable = true;
    }
    return countsAvailable;
  }

}
