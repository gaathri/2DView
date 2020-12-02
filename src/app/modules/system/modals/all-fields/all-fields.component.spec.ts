import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFieldsComponent } from './all-fields.component';

describe('AllFieldsComponent', () => {
  let component: AllFieldsComponent;
  let fixture: ComponentFixture<AllFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllFieldsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
