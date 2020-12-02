import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotAssetStatusFormComponent } from './shot-asset-status-form.component';

describe('ShotAssetStatusFormComponent', () => {
  let component: ShotAssetStatusFormComponent;
  let fixture: ComponentFixture<ShotAssetStatusFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShotAssetStatusFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotAssetStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
