import { TestBed } from '@angular/core/testing';

import { AutocadastroService } from './autocadastro';

describe('Autocadastro', () => {
  let service: AutocadastroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutocadastroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
