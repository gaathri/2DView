import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStepFormComponent } from './new-step-form.component';

describe('NewStepFormComponent', () => {
  let component: NewStepFormComponent;
  let fixture: ComponentFixture<NewStepFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewStepFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStepFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
