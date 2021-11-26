import { stagger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/@shared/loading/loading.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TournamentService } from 'src/app/@shared/services/tournament.service';
import { Chave } from '../../../../@shared/models/tournament/chave';
import { Tournament } from '../../../../@shared/models/tournament/tournament';
import { ActiveTournamentService } from '../../../../@shared/services/active-tournament.service';
import { GroupComponent } from '../group/group.component';
import { Stage } from 'src/app/@shared/models/tournament/stage';

@Component({
  selector: 'app-tournament-dashboard',
  templateUrl: './tournament-dashboard.component.html',
  styleUrls: ['./tournament-dashboard.component.scss']
})
export class TournamentDashboardComponent implements OnInit {

  tournamentId: number;
  tournament: Tournament;
  stages: Stage[];

  constructor(
    private activeTournamentService: ActiveTournamentService,
    private toastService: ToastService,
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService) {

  }

  ngOnInit(): void {
    this.tournamentId = this.activeRoute.snapshot.params.tournamentId;
    this.getActiveTournament();
    this.stages = [];
  }

  getActiveTournament() {
    this.loadingService.startLoadingBar();
    this.activeTournamentService.getTournamentById(this.tournamentId).subscribe(tournament => {
      this.tournament = tournament;
      this.activeTournamentService.getTournamentStages().subscribe(stages => {
        this.stages = stages;
      });
      this.loadingService.stopLoadingBar();
    })
  }

  proximaFase() {
    this.activeTournamentService.gerarProximaFase().subscribe(proxima => {
      console.log(proxima);
      this.toastService.success(proxima.response);
    });
  }
}
