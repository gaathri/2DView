import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAssignUsersComponent } from './group-assign-users.component';

describe('GroupAssignUsersComponent', () => {
  let component: GroupAssignUsersComponent;
  let fixture: ComponentFixture<GroupAssignUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAssignUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAssignUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
