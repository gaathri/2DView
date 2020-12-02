import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLeaveListComponent } from './user-leave-list.component';

describe('UserLeaveListComponent', () => {
  let component: UserLeaveListComponent;
  let fixture: ComponentFixture<UserLeaveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLeaveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
