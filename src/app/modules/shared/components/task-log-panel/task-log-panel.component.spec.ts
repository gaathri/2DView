import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLogPanelComponent } from './task-log-panel.component';

describe('TaskLogPanelComponent', () => {
  let component: TaskLogPanelComponent;
  let fixture: ComponentFixture<TaskLogPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskLogPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLogPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
