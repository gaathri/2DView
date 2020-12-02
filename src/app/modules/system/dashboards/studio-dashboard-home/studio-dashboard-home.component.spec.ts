import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioDashboardHomeComponent } from './studio-dashboard-home.component';

describe('StudioDashboardHomeComponent', () => {
  let component: StudioDashboardHomeComponent;
  let fixture: ComponentFixture<StudioDashboardHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioDashboardHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioDashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
