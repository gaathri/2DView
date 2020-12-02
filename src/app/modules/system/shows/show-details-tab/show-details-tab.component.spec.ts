import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDetailsTabComponent } from './show-details-tab.component';

describe('ShowDetailsTabComponent', () => {
  let component: ShowDetailsTabComponent;
  let fixture: ComponentFixture<ShowDetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
