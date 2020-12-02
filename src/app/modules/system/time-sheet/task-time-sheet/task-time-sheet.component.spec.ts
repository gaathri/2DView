import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTimeSheetComponent } from './task-time-sheet.component';

describe('TaskTimeSheetComponent', () => {
  let component: TaskTimeSheetComponent;
  let fixture: ComponentFixture<TaskTimeSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTimeSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
