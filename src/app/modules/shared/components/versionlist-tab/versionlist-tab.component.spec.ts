import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionlistTabComponent } from './versionlist-tab.component';

describe('VersionlistTabComponent', () => {
  let component: VersionlistTabComponent;
  let fixture: ComponentFixture<VersionlistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionlistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionlistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
