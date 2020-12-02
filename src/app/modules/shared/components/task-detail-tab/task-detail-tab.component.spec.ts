import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailTabComponent } from './task-detail-tab.component';

describe('TaskDetailTabComponent', () => {
  let component: TaskDetailTabComponent;
  let fixture: ComponentFixture<TaskDetailTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDetailTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
