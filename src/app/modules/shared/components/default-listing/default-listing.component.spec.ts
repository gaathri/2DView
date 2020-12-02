import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultListingComponent } from './default-listing.component';

describe('DefaultListingComponent', () => {
  let component: DefaultListingComponent;
  let fixture: ComponentFixture<DefaultListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
