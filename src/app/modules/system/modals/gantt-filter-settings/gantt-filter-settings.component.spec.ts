import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttFilterSettingsComponent } from './gantt-filter-settings.component';

describe('GanttFilterSettingsComponent', () => {
  let component: GanttFilterSettingsComponent;
  let fixture: ComponentFixture<GanttFilterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttFilterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
