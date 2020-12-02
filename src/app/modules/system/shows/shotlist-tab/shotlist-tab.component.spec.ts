import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotlistTabComponent } from './shotlist-tab.component';

describe('ShotlistTabComponent', () => {
  let component: ShotlistTabComponent;
  let fixture: ComponentFixture<ShotlistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShotlistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotlistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
