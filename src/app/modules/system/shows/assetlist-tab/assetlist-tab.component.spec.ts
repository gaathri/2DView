import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetlistTabComponent } from './assetlist-tab.component';

describe('AssetlistTabComponent', () => {
  let component: AssetlistTabComponent;
  let fixture: ComponentFixture<AssetlistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetlistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetlistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
