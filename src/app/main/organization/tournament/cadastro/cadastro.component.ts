import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/@shared/models/tournament/game';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TournamentService } from 'src/app/@shared/services/tournament.service';

export interface FormularioTournament {
  game: number;
  time: string;
  date: Date;
  name: string;
  qtdJogPorTime: number;
  qtdJogadores: number;
  battlefyLink: string;
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  formulario!: FormGroup<FormularioTournament>;

  private subscriptions: Subscription[] = [];

  constructor(private dialogRef: MatDialogRef<CadastroComponent>, private fb: FormBuilder, private toastService: ToastService,
    private organizationService: OrganizationService, private tournamentService: TournamentService, private router: Router) { }

  ngOnInit() {
    this.montarFormulario();
  }

  montarFormulario() {
    this.formulario = this.fb.group({
      name: [, [Validators.required]],
      time: [, [Validators.required]],
      date: [, [Validators.required]],
      game: [, [Validators.required]],
      qtdJogadores: [, [Validators.required]],
      qtdJogPorTime: [, [Validators.required]],
      battlefyLink: [, [Validators.required]]
    });
  }

  onSubmit() {
    const _formulario = this.formulario.value;

    const game: Game = {
      id: _formulario.game
    }

    const tournament: Tournament = {
      name: _formulario.name,
      date: Date.now().toString(),
      game: game,
      time: _formulario.time,
      qtdJogPorTime: Number.parseInt(_formulario.qtdJogPorTime.toString()),
      qtdJogadores: Number.parseInt(_formulario.qtdJogadores.toString()),
      organization: this.organizationService.getOrganization,
      battlefyLink: _formulario.battlefyLink
    }

    console.log(tournament)

    this.subscriptions.push(this.tournamentService.tournamentRegister(tournament).subscribe(tournament => {
      this.toastService.success("Torneio cadastrado com sucesso!");
      this.dialogRef.close();
    }));
  }
}
