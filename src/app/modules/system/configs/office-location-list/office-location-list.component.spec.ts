import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeLocationListComponent } from './office-location-list.component';

describe('OfficeLocationListComponent', () => {
  let component: OfficeLocationListComponent;
  let fixture: ComponentFixture<OfficeLocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeLocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
