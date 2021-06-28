import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroTeamComponent } from './cadastro-team.component';

describe('CadastroTeamComponent', () => {
  let component: CadastroTeamComponent;
  let fixture: ComponentFixture<CadastroTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
