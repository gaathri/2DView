import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrKpiComponent } from './hr-kpi.component';

describe('HrKpiComponent', () => {
  let component: HrKpiComponent;
  let fixture: ComponentFixture<HrKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
