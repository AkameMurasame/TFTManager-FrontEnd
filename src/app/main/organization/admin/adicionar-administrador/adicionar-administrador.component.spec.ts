import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarAdministradorComponent } from './adicionar-administrador.component';

describe('AdicionarAdministradorComponent', () => {
  let component: AdicionarAdministradorComponent;
  let fixture: ComponentFixture<AdicionarAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdicionarAdministradorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
