import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInsertionComponent } from './manual-insertion.component';

describe('ManualInsertionComponent', () => {
  let component: ManualInsertionComponent;
  let fixture: ComponentFixture<ManualInsertionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualInsertionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInsertionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
