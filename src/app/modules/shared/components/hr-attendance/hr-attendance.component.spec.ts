import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAttendanceComponent } from './hr-attendance.component';

describe('HrAttendanceComponent', () => {
  let component: HrAttendanceComponent;
  let fixture: ComponentFixture<HrAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
