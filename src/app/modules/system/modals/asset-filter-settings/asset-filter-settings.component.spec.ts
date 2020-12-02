import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFilterSettingsComponent } from './asset-filter-settings.component';

describe('AssetFilterSettingsComponent', () => {
  let component: AssetFilterSettingsComponent;
  let fixture: ComponentFixture<AssetFilterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetFilterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
