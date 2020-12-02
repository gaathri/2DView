import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteShotsComponent } from './favorite-shots.component';

describe('FavoriteShotsComponent', () => {
  let component: FavoriteShotsComponent;
  let fixture: ComponentFixture<FavoriteShotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteShotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteShotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
