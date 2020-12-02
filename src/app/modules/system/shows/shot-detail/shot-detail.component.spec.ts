import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotDetailComponent } from './shot-detail.component';

describe('ShotDetailComponent', () => {
  let component: ShotDetailComponent;
  let fixture: ComponentFixture<ShotDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShotDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
