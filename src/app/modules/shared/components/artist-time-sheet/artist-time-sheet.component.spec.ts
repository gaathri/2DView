import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistTimeSheetComponent } from './artist-time-sheet.component';

describe('ArtistTimeSheetComponent', () => {
  let component: ArtistTimeSheetComponent;
  let fixture: ComponentFixture<ArtistTimeSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistTimeSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
