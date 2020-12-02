import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteAssetsComponent } from './favorite-assets.component';

describe('FavoriteAssetsComponent', () => {
  let component: FavoriteAssetsComponent;
  let fixture: ComponentFixture<FavoriteAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
