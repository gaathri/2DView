import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallLeaveListComponent } from './overall-leave-list.component';

describe('OverallLeaveListComponent', () => {
  let component: OverallLeaveListComponent;
  let fixture: ComponentFixture<OverallLeaveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallLeaveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
