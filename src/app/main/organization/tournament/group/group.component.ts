import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GroupStatus } from 'src/app/@shared/enum/groupStatus.enum';
import { TeamStatus } from 'src/app/@shared/enum/teamStatus.enum';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';
import { ActiveTournamentService } from 'src/app/@shared/services/active-tournament.service';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TournamentService } from 'src/app/@shared/services/tournament.service';
import { MudarColocacaoComponent } from './mudar-colocacao/mudar-colocacao.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  tournament: Tournament;
  numeroGroup: number;
  groupStatus: boolean;
  base64String: string;

  readonly dataSource = new MatTableDataSource<any>();

  readonly displayedColumns: string[] = ['Nome do Jogador', 'Colocação', 'Acoes'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogService: MatDialog, private tournamentService: TournamentService, private activeTournamentService: ActiveTournamentService, private organizationService: OrganizationService, private toastService: ToastService) { }

  ngOnInit(): void {
    if (this.data.group[0].posicao != null) {
      let bag = [8];
      this.data.group.forEach(element => {
        bag[element.posicao - 1] = element;
      });

      this.data.group = bag;
      this.dataSource.data = this.data.group;
    } else {
      this.dataSource.data = this.data.group;
    }
    this.numeroGroup = this.data.numeroGroup;
    this.tournament = this.activeTournamentService.getTournament;
    this.groupStatus = this.data.group[0].groupStatus == GroupStatus.PARTIDA_FINALIZADA;

    if (this.groupStatus) {
      this.tournamentService.getImgMatch(this.data.group[0].groupId).subscribe(img => {
        this.base64String = "data:image/png;base64," + img.base64Image;
      });
    }

    console.log(this.data, this.tournament)
  }

  setStatusAusente(playerId: number, groupId: number) {
    this.organizationService.setStatusTeamGroup(playerId, groupId, TeamStatus.AUSENTE).subscribe(req => {
      this.toastService.success("Status alterado com sucesso!");
    });
  }

  setStatusDesistente(playerId: number, groupId: number) {
    this.organizationService.setStatusTeamGroup(playerId, groupId, TeamStatus.DESISTIU).subscribe(req => {
      this.toastService.success("Status alterado com sucesso!");
    });
  }

  redefinirColocacao(playerId: number, groupId: number) {
    this.dialogService.open(MudarColocacaoComponent, { data: { "teamId": playerId, "groupId": groupId } });
  }
}
