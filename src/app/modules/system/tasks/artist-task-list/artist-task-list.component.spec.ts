import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistTaskListComponent } from './artist-task-list.component';

describe('ArtistTaskListComponent', () => {
  let component: ArtistTaskListComponent;
  let fixture: ComponentFixture<ArtistTaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistTaskListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
