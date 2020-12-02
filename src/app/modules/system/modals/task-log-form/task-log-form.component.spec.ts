import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLogFormComponent } from './task-log-form.component';

describe('TaskLogFormComponent', () => {
  let component: TaskLogFormComponent;
  let fixture: ComponentFixture<TaskLogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskLogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskLogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
