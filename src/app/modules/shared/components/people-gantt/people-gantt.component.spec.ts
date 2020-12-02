import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleGanttComponent } from './people-gantt.component';

describe('PeopleGanttComponent', () => {
  let component: PeopleGanttComponent;
  let fixture: ComponentFixture<PeopleGanttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleGanttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
