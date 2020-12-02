import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColumnsSettingsComponent } from './table-columns-settings.component';

describe('TableColumnsSettingsComponent', () => {
  let component: TableColumnsSettingsComponent;
  let fixture: ComponentFixture<TableColumnsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableColumnsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
