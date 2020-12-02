import { TestBed } from '@angular/core/testing';

import { TasktypesService } from './tasktypes.service';

describe('TasktypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TasktypesService = TestBed.get(TasktypesService);
    expect(service).toBeTruthy();
  });
});
