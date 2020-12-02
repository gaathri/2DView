import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotAllFieldsComponent } from './shot-all-fields.component';

describe('ShotAllFieldsComponent', () => {
  let component: ShotAllFieldsComponent;
  let fixture: ComponentFixture<ShotAllFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShotAllFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotAllFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
