import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasktypeFormComponent } from './tasktype-form.component';

describe('TasktypeFormComponent', () => {
  let component: TasktypeFormComponent;
  let fixture: ComponentFixture<TasktypeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasktypeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasktypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
