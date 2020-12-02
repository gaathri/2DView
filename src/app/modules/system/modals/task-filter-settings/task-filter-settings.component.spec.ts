import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFilterSettingsComponent } from './task-filter-settings.component';

describe('TaskFilterSettingsComponent', () => {
  let component: TaskFilterSettingsComponent;
  let fixture: ComponentFixture<TaskFilterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskFilterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
