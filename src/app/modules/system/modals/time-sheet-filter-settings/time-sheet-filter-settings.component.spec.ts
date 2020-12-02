import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetFilterSettingsComponent } from './time-sheet-filter-settings.component';

describe('TimeSheetFilterSettingsComponent', () => {
  let component: TimeSheetFilterSettingsComponent;
  let fixture: ComponentFixture<TimeSheetFilterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetFilterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
