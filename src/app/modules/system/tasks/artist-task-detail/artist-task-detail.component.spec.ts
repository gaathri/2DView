import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistTaskDetailComponent } from './artist-task-detail.component';

describe('ArtistTaskDetailComponent', () => {
  let component: ArtistTaskDetailComponent;
  let fixture: ComponentFixture<ArtistTaskDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistTaskDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
