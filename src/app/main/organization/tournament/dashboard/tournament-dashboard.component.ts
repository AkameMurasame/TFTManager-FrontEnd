import { stagger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/@shared/loading/loading.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { Chave } from '../../../../@shared/models/tournament/chave';
import { Tournament } from '../../../../@shared/models/tournament/tournament';
import { ActiveTournamentService } from '../../../../@shared/services/active-tournament.service';
import { GroupComponent } from '../group/group.component';

@Component({
  selector: 'app-tournament-dashboard',
  templateUrl: './tournament-dashboard.component.html',
  styleUrls: ['./tournament-dashboard.component.scss']
})
export class TournamentDashboardComponent implements OnInit {

  tournamentId: number;
  tournament: Tournament;
  stages: Chave[];

  constructor(
    private activeTournamentService: ActiveTournamentService, 
    private toastService: ToastService, 
    private activeRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private dialogService: MatDialog) {

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
        if (this.activeTournamentService.getGroups.length == 0) {
          stages.forEach(element => {
            this.activeTournamentService.getGroupsStage(element.id).subscribe(group => {
              var g = [];
              var a = [];

              for (var x = 0; x < group.length; x++) {
                if (x == 0) {
                  g.push(group[x]);
                } else {
                  if (group[x - 1].groupId == group[x].groupId) {
                    g.push(group[x]);
                    if (x == (group.length - 1)) {
                      a.push(g);
                      g = [];
                    }
                  } else {
                    a.push(g);
                    g = [];
                    g.push(group[x])
                  }
                }
              }

              const stage: Chave = {
                stage: element,
                groups: a
              };
              console.log(stage)
              this.activeTournamentService.setGroups = stage;
              this.stages = this.activeTournamentService.getGroups;
            })
          });
        } else {
          for (var x = stages.length; x == 0; x--) {
            this.activeTournamentService.getGroupsStage(stages[x].id).subscribe(group => {
              console.log(group)
              this.loadingService.stopLoadingBar();
            })
          }
          this.stages = this.activeTournamentService.getGroups;
        }
      });
      this.loadingService.stopLoadingBar();
    })
  }

  detalhesGroup(group, numeroGroup) {
    this.dialogService.open(GroupComponent, {
      data: { "group": group, "numeroGroup": numeroGroup },
      height: "83%",
      width: "83%"
    });
  }

  proximaFase() {
    this.activeTournamentService.gerarProximaFase().subscribe(proxima => {
      this.toastService.success("Proxima fase sendo gerada!");
    });
  }
}
