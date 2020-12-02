import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstatusFormComponent } from './workstatus-form.component';

describe('WorkstatusFormComponent', () => {
  let component: WorkstatusFormComponent;
  let fixture: ComponentFixture<WorkstatusFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkstatusFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
