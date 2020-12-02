import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFilterSettingsComponent } from './report-filter-settings.component';

describe('ReportFilterSettingsComponent', () => {
  let component: ReportFilterSettingsComponent;
  let fixture: ComponentFixture<ReportFilterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFilterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
