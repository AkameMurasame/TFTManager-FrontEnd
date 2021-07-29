import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/@riotApi/services/match.service';
import { AuthenticationService } from 'src/app/@shared/services/authentication.service';
import { PlayerService } from 'src/app/@shared/services/player.service';
import { LcuService } from '../../../@shared/services/lcu.service';
import { WebsocketService } from '../../../@shared/services/websocket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  partidas: String[] = [];

  constructor(private playerService: PlayerService, private authService: AuthenticationService, private matchService: MatchService,
    private router: Router, private w: WebsocketService, private lcu: LcuService
  ) { }

  ngOnInit() {
    
  }

  getPartidasTft() {
    console.log(this.playerService.getPlayer)
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
}
