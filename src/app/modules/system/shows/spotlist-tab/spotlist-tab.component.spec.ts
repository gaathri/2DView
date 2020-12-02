import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlistTabComponent } from './spotlist-tab.component';

describe('SpotlistTabComponent', () => {
  let component: SpotlistTabComponent;
  let fixture: ComponentFixture<SpotlistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotlistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
