import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDetailTabComponent } from './asset-detail-tab.component';

describe('AssetDetailTabComponent', () => {
  let component: AssetDetailTabComponent;
  let fixture: ComponentFixture<AssetDetailTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDetailTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDetailTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
