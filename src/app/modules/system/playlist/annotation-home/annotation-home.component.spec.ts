import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationHomeComponent } from './annotation-home.component';

describe('AnnotationHomeComponent', () => {
  let component: AnnotationHomeComponent;
  let fixture: ComponentFixture<AnnotationHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
