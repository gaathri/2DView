import { TestBed } from '@angular/core/testing';

import { ShotsService } from './shots.service';

describe('ShotsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShotsService = TestBed.get(ShotsService);
    expect(service).toBeTruthy();
  });
});
