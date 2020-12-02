import { TestBed } from '@angular/core/testing';

import { OfficeLocationService } from './office-location.service';

describe('OfficeLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfficeLocationService = TestBed.get(OfficeLocationService);
    expect(service).toBeTruthy();
  });
});
