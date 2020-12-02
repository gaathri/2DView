import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogPanelComponent } from './activity-log-panel.component';

describe('ActivityLogPanelComponent', () => {
  let component: ActivityLogPanelComponent;
  let fixture: ComponentFixture<ActivityLogPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLogPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
