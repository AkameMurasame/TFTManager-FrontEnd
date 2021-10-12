import { Component, OnInit } from '@angular/core';
import { MatchDTO, MatchService } from 'src/app/@riotApi';
import { AuthenticationService } from 'src/app/@shared/services/authentication.service';
import { PlayerService } from 'src/app/@shared/services/player.service';

@Component({
  selector: 'app-dash-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  listMatch: MatchDTO[];
  listIndex: number[];
  carregado: boolean = false;

  constructor(private playerService: PlayerService, private authService: AuthenticationService, private matchService: MatchService) { }

  ngOnInit(): void {
    this.getPartidasTft();
  }

  getPartidasTft() {
    if (!this.playerService.getPlayer) {
      this.playerService.getPlayerByUserId(this.authService.currentUserValue.user.id).subscribe(player => {
        this.getInApi(player.puuid);
      });
    } else {
      this.getInApi(this.playerService.getPlayer.puuid);
    }
  }

  getInApi(puuid: string) {
   
  }
}
