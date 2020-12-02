import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountFormComponent } from './my-account-form.component';

describe('MyAccountFormComponent', () => {
  let component: MyAccountFormComponent;
  let fixture: ComponentFixture<MyAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAccountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
