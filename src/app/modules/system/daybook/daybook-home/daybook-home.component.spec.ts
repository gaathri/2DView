import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaybookHomeComponent } from './daybook-home.component';

describe('DaybookHomeComponent', () => {
  let component: DaybookHomeComponent;
  let fixture: ComponentFixture<DaybookHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaybookHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaybookHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
