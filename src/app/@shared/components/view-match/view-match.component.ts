import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { LoadingService } from '../../loading/loading.service';
import { Match } from '../../models/player/Match';
import { Player } from '../../models/player/Player';
import { MatchResponse } from '../../models/tournament/matchResponse';
import { DataDragonService } from '../../services/data-dragon.service';
import { LcuService } from '../../services/lcu.service';
import { PlayerService } from '../../services/player.service';
import { ToastService } from '../../services/toast.service';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-view-match',
  templateUrl: './view-match.component.html',
  styleUrls: ['./view-match.component.scss']
})
export class ViewMatchComponent implements OnInit {

  urlIcon: String = "";
  player: Player;
  match: MatchResponse;
  file: File = null; // Variable to store file
  base64String: any;

  readonly dataSource = new MatTableDataSource<any>();

  readonly displayedColumns: string[] = ['Nome do Jogador', 'Colocação', 'Status'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Match, private loadingService: LoadingService, private toastService: ToastService, private lcuService: LcuService, private dataDragonService: DataDragonService, private tournamentService: TournamentService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.player = this.lcuService.lcuPlayer;
    this.urlIcon = this.dataDragonService.getUrlProfileIcon(this.player.profileIconId);
    this.init();
  }

  init() {
    this.loadingService.startLoadingBar();
    this.tournamentService.geMatch(this.data.groupId).subscribe(e => {
      this.match = e;
      console.log(this.match)
      this.dataSource.data = e.groupTeams;
      this.loadingService.stopLoadingBar();
    })
  }

  findPlayer(nickname: string) {
    this.lcuService.findPlayer(nickname).subscribe(player => {
      return this.dataDragonService.getUrlProfileIcon(player.profileIconId);
    })
  }

  async onChange(event) {
    this.file = event.target.files[0];
    this.base64String = await this.toBase64(this.file);
    console.log(this.base64String)
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
