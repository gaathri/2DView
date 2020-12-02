import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasklistTabComponent } from './tasklist-tab.component';

describe('TasklistTabComponent', () => {
  let component: TasklistTabComponent;
  let fixture: ComponentFixture<TasklistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasklistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasklistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
