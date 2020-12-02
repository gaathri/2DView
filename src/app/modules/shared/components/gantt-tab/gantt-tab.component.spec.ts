import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttTabComponent } from './gantt-tab.component';

describe('GanttTabComponent', () => {
  let component: GanttTabComponent;
  let fixture: ComponentFixture<GanttTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
