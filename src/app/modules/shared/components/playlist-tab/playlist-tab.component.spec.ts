import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistTabComponent } from './playlist-tab.component';

describe('PlaylistTabComponent', () => {
  let component: PlaylistTabComponent;
  let fixture: ComponentFixture<PlaylistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
