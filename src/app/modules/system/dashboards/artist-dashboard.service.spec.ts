import { TestBed } from '@angular/core/testing';

import { ArtistDashboardService } from './artist-dashboard.service';

describe('ArtistDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArtistDashboardService = TestBed.get(ArtistDashboardService);
    expect(service).toBeTruthy();
  });
});
