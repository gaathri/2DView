import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRoleListComponent } from './my-role-list.component';

describe('MyRoleListComponent', () => {
  let component: MyRoleListComponent;
  let fixture: ComponentFixture<MyRoleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRoleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
