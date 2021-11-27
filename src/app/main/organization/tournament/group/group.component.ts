import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { dialog } from 'electron';
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
  groupStatus: String;
  file: File = null; // Variable to store file
  base64String: any;
  nick: string = '';

  readonly dataSource = new MatTableDataSource<any>();

  readonly displayedColumns: string[] = ['Nome do Jogador', 'Colocação', 'Acoes'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService: MatDialog,
    private tournamentService: TournamentService,
    private organizationService: OrganizationService,
    private toastService: ToastService,
    private activeTournamentService: ActiveTournamentService) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.numeroGroup = this.data.numeroGroup;
    this.tournament = this.activeTournamentService.getTournament;
    this.tournamentService.getTeamsByGroup(this.data.groupId).subscribe(teams => {
      this.dataSource.data = teams;
      this.groupStatus = teams[0].groupStatus.toString();
      console.log(this.groupStatus)
      if (this.groupStatus === "PARTIDA_FINALIZADA") {
        this.tournamentService.getImgMatch(this.data.groupId).subscribe(img => {
          this.base64String = "data:image/png;base64," + img.base64Image;
        });
      }
    });
  }

  async onChange(event) {
    this.file = event.target.files[0];
    this.base64String = await this.toBase64(this.file);
    console.log(this.base64String)
  }

  matchResult() {
    this.tournamentService.organizationMatchResult(this.file, this.data.groupId, this.nick).subscribe(data => {
      this.toastService.success(data.response);
      this.init();
    });
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

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
