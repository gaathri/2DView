import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeFormComponent } from './episode-form.component';

describe('EpisodeFormComponent', () => {
  let component: EpisodeFormComponent;
  let fixture: ComponentFixture<EpisodeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
