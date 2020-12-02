import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistTableViewComponent } from './artist-table-view.component';

describe('ArtistTableViewComponent', () => {
  let component: ArtistTableViewComponent;
  let fixture: ComponentFixture<ArtistTableViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistTableViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
