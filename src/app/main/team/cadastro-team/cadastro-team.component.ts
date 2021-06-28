import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Subscription } from 'rxjs';
import { TeamType } from '../../../@shared/enum/teamType.enum';
import { Team } from '../../../@shared/models/team/team';
import { PlayerService } from '../../../@shared/services/player.service';
import { TeamService } from '../../../@shared/services/team.service';

export interface FormularioTeam {
  nomeTeam: string;
  logo: string;
}

@Component({
  selector: 'app-cadastro-team',
  templateUrl: './cadastro-team.component.html',
  styleUrls: ['./cadastro-team.component.scss']
})
export class CadastroTeamComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CadastroTeamComponent>, private teamService: TeamService, private playerService: PlayerService) { }

  private subscriptions: Subscription[] = [];

  formulario!: FormGroup<FormularioTeam>;

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit() {
    this.construirFormulario();
  }

  construirFormulario() {
    this.formulario = this.fb.group<FormularioTeam>({
      nomeTeam: ['', [Validators.required]],
      logo: ['', [Validators.required]]
    });
  }

  onSubmit() {
    const _formulario = this.formulario.value;

    const request: Team = {
      name: _formulario.nomeTeam,
      capitain: this.playerService.getPlayer.accountId,
      teamType: TeamType.MULTIPLAYER,
      logo: _formulario.logo
    };

    this.subscriptions.push(this.teamService.teamRegister(request).subscribe(team => {
      //notificação para sucesso
      this.dialogRef.close();
    }));
  }
}
