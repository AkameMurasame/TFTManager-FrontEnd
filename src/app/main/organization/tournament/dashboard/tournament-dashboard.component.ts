import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chave } from '../../../../@shared/models/tournament/chave';
import { Group } from '../../../../@shared/models/tournament/group';
import { Stage } from '../../../../@shared/models/tournament/stage';
import { Tournament } from '../../../../@shared/models/tournament/tournament';
import { ActiveTournamentService } from '../../../../@shared/services/active-tournament.service';

@Component({
  selector: 'app-tournament-dashboard',
  templateUrl: './tournament-dashboard.component.html',
  styleUrls: ['./tournament-dashboard.component.scss']
})
export class TournamentDashboardComponent implements OnInit {

  tournamentId: number;
  tournament: Tournament;
  stages: Chave[];

  constructor(private activeTournamentService: ActiveTournamentService, private activeRoute: ActivatedRoute) {
    this.tournamentId = this.activeRoute.snapshot.params.tournamentId;
    this.getActiveTournament();
    this.stages = [];
  }

  ngOnInit(): void {

  }

  getActiveTournament() {
    this.activeTournamentService.getTournamentById(this.tournamentId).subscribe(tournament => {
      this.tournament = tournament;
      this.activeTournamentService.getTournamentStages().subscribe(stages => {
        if (this.activeTournamentService.getGroups.length == 0) {
          this.activeTournamentService.getGroupsStage(stages[0].id).subscribe(group => {

            var g = [];
            var a = [];

            for (var x = 0; x < group.length; x++) {
              if (x == 0) {
                g.push(group[x]);
              } else {
                if (group[x - 1].groupId == group[x].groupId) {
                  g.push(group[x]);
                } else {
                  a.push(g);
                  g = [];
                  g.push(group[x])
                }
              }
            }

            const stage: Chave = {
              stage: stages[0],
              groups: a
            };

            this.activeTournamentService.setGroups = stage;
            this.stages = this.activeTournamentService.getGroups;
            console.log(this.stages)
          })
        } else {
          for (var x = stages.length; x == 0; x--) {
            this.activeTournamentService.getGroupsStage(stages[x].id).subscribe(group => {
              console.log(group)
            })
          }
        }
      });
    });
  }
}
