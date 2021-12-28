import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { dialog } from 'electron';
import { GroupStatus } from 'src/app/@shared/enum/groupStatus.enum';
import { TeamStatus } from 'src/app/@shared/enum/teamStatus.enum';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';
import { ActiveTournamentService } from 'src/app/@shared/services/active-tournament.service';
import { MatchService } from 'src/app/@shared/services/match.service';
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
  groupStatus: String;
  file: File = null; // Variable to store file
  base64String: any;
  nick: string = '';

  readonly dataSource = new MatTableDataSource<any>();

  readonly displayedColumns: string[] = ['Nome do Jogador', 'Colocação',  'Status', 'Acoes'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService: MatDialog,
    private tournamentService: TournamentService,
    private organizationService: OrganizationService,
    private toastService: ToastService,
    private activeTournamentService: ActiveTournamentService,
    private matchService: MatchService) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.numeroGroup = this.data.numeroGroup;
    this.tournament = this.activeTournamentService.getTournament;
    this.tournamentService.getTeamsByGroup(this.data.groupId).subscribe(teams => {
      this.dataSource.data = teams;
      this.groupStatus = teams[0].groupStatus.toString();
    });
  }

  async onChange(event) {
    this.file = event.target.files[0];
    this.base64String = await this.toBase64(this.file);
    console.log(this.base64String)
  }

  matchResult() {
    this.matchService.organizationMatchResult(this.data.groupId, this.nick).subscribe(data => {
      this.toastService.success(data.response);
      this.init();
    });
  }

  setStatusAusente(playerId: number, groupId: number) {
    this.organizationService.setStatusTeamGroup(playerId, groupId, TeamStatus.AUSENTE).subscribe(req => {
      this.toastService.success("Status alterado com sucesso!");
      this.init();
    });
  }

  setStatusEmPartida(playerId: number, groupId: number) {
    this.organizationService.setStatusTeamGroup(playerId, groupId, TeamStatus.GAME).subscribe(req => {
      this.toastService.success("Status alterado com sucesso!");
      this.init();
    });
  }

  redefinirColocacao(playerId: number, groupId: number) {
    this.dialogService.open(MudarColocacaoComponent, { data: { "teamId": playerId, "groupId": groupId } });
  }

  wo() {
    this.matchService.wo(this.data.groupId).subscribe(data => {
      this.toastService.success(data.response);
      this.init();
    });
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
