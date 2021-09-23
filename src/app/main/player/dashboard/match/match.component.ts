import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewMatchComponent } from 'src/app/@shared/components/view-match/view-match.component';
import { Match } from 'src/app/@shared/models/player/Match';
import { DataDragonService } from 'src/app/@shared/services/data-dragon.service';
import { LcuService } from 'src/app/@shared/services/lcu.service';
import { PlayerService } from 'src/app/@shared/services/player.service';

@Component({
  selector: 'app-dash-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  matchList: Match[];
  urlIcon: String = "";

  constructor(private playerService: PlayerService, private lcuService: LcuService, private dialogService: MatDialog, private dataDragonService: DataDragonService) {

  }

  ngOnInit(): void {
    this.urlIcon = this.dataDragonService.getUrlProfileIcon(this.lcuService.lcuPlayer.profileIconId);
    this.playerService.getMatchesByPlayer().subscribe(matchs => {
      console.log(matchs)
      this.matchList = matchs;
    })
  }

  openPartida(match) {
    this.dialogService.open(ViewMatchComponent, {
      data: match,
      width: '75%',
      height: '75%'
    });
  }
}
