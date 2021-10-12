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
  file: File = null; // Variable to store file
  base64String: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Match, private lcuService: LcuService, private dataDragonService: DataDragonService, private tournamentService: TournamentService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.player = this.lcuService.lcuPlayer;
    this.urlIcon = this.dataDragonService.getUrlProfileIcon(this.player.profileIconId);
    this.tournamentService.geMatch(this.data.groupId).subscribe(e => {
      console.log(e)
      this.match = e;
      if (e.imgId) {
        this.tournamentService.getImgMatch(this.data.groupId).subscribe(img => {
          this.base64String = "data:image/png;base64," + img.base64Image;
          console.log(this.base64String)
        });
      }
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

  matchResult() {
    this.tournamentService.matchResult(this.file, this.data.groupId).subscribe(data => {
      console.log(data, "foi");
    });
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

}
