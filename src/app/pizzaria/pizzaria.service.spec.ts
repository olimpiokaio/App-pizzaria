import { TestBed } from '@angular/core/testing';

import { PizzariaService } from './pizzaria.service';

describe('PizzariaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PizzariaService = TestBed.get(PizzariaService);
    expect(service).toBeTruthy();
  });
});
