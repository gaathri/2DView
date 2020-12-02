import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioDbSettingsComponent } from './studio-db-settings.component';

describe('StudioDbSettingsComponent', () => {
  let component: StudioDbSettingsComponent;
  let fixture: ComponentFixture<StudioDbSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioDbSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioDbSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
