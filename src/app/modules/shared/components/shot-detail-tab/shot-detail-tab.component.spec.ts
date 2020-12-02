import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotDetailTabComponent } from './shot-detail-tab.component';

describe('ShotDetailTabComponent', () => {
  let component: ShotDetailTabComponent;
  let fixture: ComponentFixture<ShotDetailTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShotDetailTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotDetailTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
