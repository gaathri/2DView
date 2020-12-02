import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarPanelComponent } from './star-panel.component';

describe('StarPanelComponent', () => {
  let component: StarPanelComponent;
  let fixture: ComponentFixture<StarPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
