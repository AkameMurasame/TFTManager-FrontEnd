import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { Match } from '../../models/player/Match';
import { Player } from '../../models/player/Player';
import { MatchResponse } from '../../models/tournament/matchResponse';
import { DataDragonService } from '../../services/data-dragon.service';
import { LcuService } from '../../services/lcu.service';
import { PlayerService } from '../../services/player.service';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Match, private lcuService: LcuService, private dataDragonService: DataDragonService, private tournamentService: TournamentService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.player = this.lcuService.lcuPlayer;
    this.urlIcon = this.dataDragonService.getUrlProfileIcon(this.player.profileIconId);
    this.tournamentService.geMatch(this.data.groupId).subscribe(e => {
      console.log(e)
      this.match = e;
    })
  }

  findPlayer(nickname: string) {
    this.lcuService.findPlayer(nickname).subscribe(player => {
      return this.dataDragonService.getUrlProfileIcon(player.profileIconId);
    })
  }
}
