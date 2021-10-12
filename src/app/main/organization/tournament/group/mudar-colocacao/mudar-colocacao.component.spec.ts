import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MudarColocacaoComponent } from './mudar-colocacao.component';

describe('MudarColocacaoComponent', () => {
  let component: MudarColocacaoComponent;
  let fixture: ComponentFixture<MudarColocacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MudarColocacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MudarColocacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
