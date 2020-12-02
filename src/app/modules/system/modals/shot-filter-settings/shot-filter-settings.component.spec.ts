import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotFilterSettingsComponent } from './shot-filter-settings.component';

describe('ShotFilterSettingsComponent', () => {
  let component: ShotFilterSettingsComponent;
  let fixture: ComponentFixture<ShotFilterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShotFilterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
