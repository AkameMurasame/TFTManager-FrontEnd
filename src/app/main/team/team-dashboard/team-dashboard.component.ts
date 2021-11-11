import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/@shared/loading/loading.service';

import { TeamService } from '../../../@shared/services/team.service';

import { CadastroTeamComponent } from '../cadastro-team/cadastro-team.component';

import { Team } from '../../../@shared/models/team/team';

@Component({
  selector: 'app-team-dashboard',
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.scss']
})
export class TeamDashboardComponent implements OnInit {

  teams: Team[];

  constructor(private loadingService: LoadingService, private dialogService: MatDialog, private teamService: TeamService) { }

  ngOnInit(): void {
    this.loadingService.startLocalLoading('.card-body');
    this.teamService.getTeamsByPlayerId().subscribe(teams => {
      this.teams = teams;
      this.loadingService.stopLocalLoading('.card-body');
    });
  }

  novoTime() {
    this.dialogService.open(CadastroTeamComponent);
  }
}
