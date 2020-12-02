import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStatusListComponent } from './work-status-list.component';

describe('WorkStatusListComponent', () => {
  let component: WorkStatusListComponent;
  let fixture: ComponentFixture<WorkStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
