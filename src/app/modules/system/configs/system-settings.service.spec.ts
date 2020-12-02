import { TestBed } from '@angular/core/testing';

import { SystemSettingsService } from './system-settings.service';

describe('SystemSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemSettingsService = TestBed.get(SystemSettingsService);
    expect(service).toBeTruthy();
  });
});
