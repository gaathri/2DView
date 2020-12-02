import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistInternalComponent } from './playlist-internal.component';

describe('PlaylistInternalComponent', () => {
  let component: PlaylistInternalComponent;
  let fixture: ComponentFixture<PlaylistInternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
