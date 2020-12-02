import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistInternalTableComponent } from './playlist-internal-table.component';

describe('PlaylistInternalTableComponent', () => {
  let component: PlaylistInternalTableComponent;
  let fixture: ComponentFixture<PlaylistInternalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistInternalTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistInternalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
