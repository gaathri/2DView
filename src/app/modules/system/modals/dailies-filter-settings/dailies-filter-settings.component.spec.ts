import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailiesFilterSettingsComponent } from './dailies-filter-settings.component';

describe('DailiesFilterSettingsComponent', () => {
  let component: DailiesFilterSettingsComponent;
  let fixture: ComponentFixture<DailiesFilterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailiesFilterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailiesFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
