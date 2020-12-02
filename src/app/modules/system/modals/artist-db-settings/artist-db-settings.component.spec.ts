import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDbSettingsComponent } from './artist-db-settings.component';

describe('ArtistDbSettingsComponent', () => {
  let component: ArtistDbSettingsComponent;
  let fixture: ComponentFixture<ArtistDbSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistDbSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistDbSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
