import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTimeSheetReviewComponent } from './task-time-sheet-review.component';

describe('TaskTimeSheetReviewComponent', () => {
  let component: TaskTimeSheetReviewComponent;
  let fixture: ComponentFixture<TaskTimeSheetReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTimeSheetReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTimeSheetReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
