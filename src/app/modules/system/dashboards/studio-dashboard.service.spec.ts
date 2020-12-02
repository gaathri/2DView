import { TestBed } from '@angular/core/testing';

import { StudioDashboardService } from './studio-dashboard.service';

describe('StudioDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudioDashboardService = TestBed.get(StudioDashboardService);
    expect(service).toBeTruthy();
  });
});
