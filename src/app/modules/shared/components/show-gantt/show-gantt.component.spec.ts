import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGanttComponent } from './show-gantt.component';

describe('ShowGanttComponent', () => {
  let component: ShowGanttComponent;
  let fixture: ComponentFixture<ShowGanttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowGanttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
