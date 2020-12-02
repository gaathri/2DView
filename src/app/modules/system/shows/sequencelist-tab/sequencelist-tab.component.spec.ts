import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequencelistTabComponent } from './sequencelist-tab.component';

describe('SequencelistTabComponent', () => {
  let component: SequencelistTabComponent;
  let fixture: ComponentFixture<SequencelistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequencelistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequencelistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
