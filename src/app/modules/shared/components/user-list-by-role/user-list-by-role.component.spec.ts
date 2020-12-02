import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListByRoleComponent } from './user-list-by-role.component';

describe('UserListByRoleComponent', () => {
  let component: UserListByRoleComponent;
  let fixture: ComponentFixture<UserListByRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserListByRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListByRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
