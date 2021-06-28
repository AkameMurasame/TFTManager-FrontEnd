import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Team } from '../../../@shared/models/team/team';
import { TeamService } from '../../../@shared/services/team.service';
import { CadastroTeamComponent } from '../cadastro-team/cadastro-team.component';

@Component({
  selector: 'app-team-dashboard',
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.scss']
})
export class TeamDashboardComponent implements OnInit {

  teams: Team[];

  constructor(private dialogService: MatDialog, private teamService: TeamService) { }

  ngOnInit(): void {
    this.teamService.getTeamsByPlayerId().subscribe(teams => {
      this.teams = teams;
    });
  }

  novoTime() {
    this.dialogService.open(CadastroTeamComponent);
  }
}
