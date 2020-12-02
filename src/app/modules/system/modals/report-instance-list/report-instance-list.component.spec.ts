import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInstanceListComponent } from './report-instance-list.component';

describe('ReportInstanceListComponent', () => {
  let component: ReportInstanceListComponent;
  let fixture: ComponentFixture<ReportInstanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportInstanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInstanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
