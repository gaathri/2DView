import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeLocationFormComponent } from './office-location-form.component';

describe('OfficeLocationFormComponent', () => {
  let component: OfficeLocationFormComponent;
  let fixture: ComponentFixture<OfficeLocationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeLocationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeLocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
