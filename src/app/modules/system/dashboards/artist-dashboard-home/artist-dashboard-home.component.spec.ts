import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDashboardHomeComponent } from './artist-dashboard-home.component';

describe('ArtistDashboardHomeComponent', () => {
  let component: ArtistDashboardHomeComponent;
  let fixture: ComponentFixture<ArtistDashboardHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistDashboardHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistDashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
