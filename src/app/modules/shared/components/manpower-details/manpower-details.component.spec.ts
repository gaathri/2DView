import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerDetailsComponent } from './manpower-details.component';

describe('ManpowerDetailsComponent', () => {
  let component: ManpowerDetailsComponent;
  let fixture: ComponentFixture<ManpowerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManpowerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManpowerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
