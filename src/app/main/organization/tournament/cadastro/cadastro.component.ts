import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/@shared/models/tournament/game';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { TournamentService } from 'src/app/@shared/services/tournament.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  constructor(private organizationService: OrganizationService, private tournamentService: TournamentService, private router: Router) { }

  ngOnInit() {
    this.onSubmit();
  }

  onSubmit() {
    let game = new Game();
    game.id = 1;

    let tournament = new Tournament();
    tournament.time = "19:00";
    tournament.date = Date.now().toString();
    tournament.game = game;
    tournament.name = "Campeonato de Teste";
    tournament.organization = this.organizationService.getOrganization;

    this.tournamentService.tournamentRegister(tournament).subscribe(tournament => {
      this.router.navigate(['organization/dashboard']);
    });
  }
}
