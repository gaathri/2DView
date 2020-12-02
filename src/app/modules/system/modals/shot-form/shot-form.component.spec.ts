import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotFormComponent } from './shot-form.component';

describe('ShotFormComponent', () => {
  let component: ShotFormComponent;
  let fixture: ComponentFixture<ShotFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShotFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
