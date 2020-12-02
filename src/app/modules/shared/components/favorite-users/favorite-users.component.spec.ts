import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteUsersComponent } from './favorite-users.component';

describe('FavoriteUsersComponent', () => {
  let component: FavoriteUsersComponent;
  let fixture: ComponentFixture<FavoriteUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
