import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTemplateListComponent } from './report-template-list.component';

describe('ReportTemplateListComponent', () => {
  let component: ReportTemplateListComponent;
  let fixture: ComponentFixture<ReportTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
