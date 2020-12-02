import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTreeTableComponent } from './template-tree-table.component';

describe('TemplateTreeTableComponent', () => {
  let component: TemplateTreeTableComponent;
  let fixture: ComponentFixture<TemplateTreeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateTreeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateTreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
