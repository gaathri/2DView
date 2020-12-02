import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonlistTabComponent } from './seasonlist-tab.component';

describe('SeasonlistTabComponent', () => {
  let component: SeasonlistTabComponent;
  let fixture: ComponentFixture<SeasonlistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonlistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonlistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
