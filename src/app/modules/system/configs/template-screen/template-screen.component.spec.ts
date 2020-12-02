import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateScreenComponent } from './template-screen.component';

describe('TemplateScreenComponent', () => {
  let component: TemplateScreenComponent;
  let fixture: ComponentFixture<TemplateScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
