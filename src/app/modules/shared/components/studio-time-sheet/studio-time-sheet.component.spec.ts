import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioTimeSheetComponent } from './studio-time-sheet.component';

describe('StudioTimeSheetComponent', () => {
  let component: StudioTimeSheetComponent;
  let fixture: ComponentFixture<StudioTimeSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioTimeSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
