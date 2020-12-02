import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListReportComponent } from './task-list-report.component';

describe('TaskListReportComponent', () => {
  let component: TaskListReportComponent;
  let fixture: ComponentFixture<TaskListReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskListReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
