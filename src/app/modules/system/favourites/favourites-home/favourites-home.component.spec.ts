import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesHomeComponent } from './favourites-home.component';

describe('FavouritesHomeComponent', () => {
  let component: FavouritesHomeComponent;
  let fixture: ComponentFixture<FavouritesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouritesHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
