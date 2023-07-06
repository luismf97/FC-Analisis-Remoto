import { TestBed, async, inject } from '@angular/core/testing';

import { ValidarGuard } from './validar.guard';

describe('ValidarGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidarGuard]
    });
  });

  it('should ...', inject([ValidarGuard], (guard: ValidarGuard) => {
    expect(guard).toBeTruthy();
  }));
});
