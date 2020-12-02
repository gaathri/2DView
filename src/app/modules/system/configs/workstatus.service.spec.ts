import { TestBed } from '@angular/core/testing';

import { WorkstatusService } from './workstatus.service';

describe('WorkstatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkstatusService = TestBed.get(WorkstatusService);
    expect(service).toBeTruthy();
  });
});
