import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/@riotApi/services/match.service';
import { Group } from 'src/app/@shared/models/tournament/group';
import { AuthenticationService } from 'src/app/@shared/services/authentication.service';
import { PlayerService } from 'src/app/@shared/services/player.service';
import { TournamentService } from 'src/app/@shared/services/tournament.service';
import { LcuService } from '../../../@shared/services/lcu.service';
import { WebsocketService } from '../../../@shared/services/websocket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  partidas: String[] = [];
  activeGroup: Group;

  constructor(private playerService: PlayerService, private authService: AuthenticationService, private matchService: MatchService,
    private router: Router, private w: WebsocketService, private lcu: LcuService
  ) { }

  ngOnInit() {
    
  }

  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

  getPartidasTft() {
    if (!this.playerService.getPlayer) {
      this.playerService.getPlayerByUserId(this.authService.currentUserValue.user.id).subscribe(player => {
        //this.getInApi(player.puuid);
      });
    } else {
      //this.getInApi(this.playerService.getPlayer.puuid);
    }
  }

  getInApi(puuid: string) {
    this.matchService.getCodigoPartidasTft(puuid, 100).subscribe(partidas => {
      console.log(partidas)
      this.matchService.getPartidaTft(partidas[0]).subscribe(partida => {
        console.log(partida);
        console.log(this.matchService.historicoPartidas)
      })
    });
  }

  getPartidaAtiva() {
    this.playerService.getActiveMatchByPlayer().subscribe(group => {
      console.log(group)
      this.activeGroup = group;
    });
  }
}
