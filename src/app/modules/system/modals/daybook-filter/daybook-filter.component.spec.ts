import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaybookFilterComponent } from './daybook-filter.component';

describe('DaybookFilterComponent', () => {
  let component: DaybookFilterComponent;
  let fixture: ComponentFixture<DaybookFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaybookFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaybookFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
