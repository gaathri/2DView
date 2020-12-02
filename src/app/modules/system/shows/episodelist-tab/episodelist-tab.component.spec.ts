import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodelistTabComponent } from './episodelist-tab.component';

describe('EpisodelistTabComponent', () => {
  let component: EpisodelistTabComponent;
  let fixture: ComponentFixture<EpisodelistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodelistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodelistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
