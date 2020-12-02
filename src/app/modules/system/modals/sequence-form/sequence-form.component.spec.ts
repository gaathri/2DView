import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceFormComponent } from './sequence-form.component';

describe('SequenceFormComponent', () => {
  let component: SequenceFormComponent;
  let fixture: ComponentFixture<SequenceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
