import { TestBed } from '@angular/core/testing';

import { GestionTareaService } from './gestion-tarea.service';

describe('GestionTareaService', () => {
  let service: GestionTareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionTareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
