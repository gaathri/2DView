import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteTabComponent } from './favourite-tab.component';

describe('FavouriteTabComponent', () => {
  let component: FavouriteTabComponent;
  let fixture: ComponentFixture<FavouriteTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
