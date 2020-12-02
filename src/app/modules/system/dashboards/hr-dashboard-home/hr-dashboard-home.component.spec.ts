import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDashboardHomeComponent } from './hr-dashboard-home.component';

describe('HrDashboardHomeComponent', () => {
  let component: HrDashboardHomeComponent;
  let fixture: ComponentFixture<HrDashboardHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrDashboardHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrDashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
