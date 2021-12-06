import { Component, OnInit } from '@angular/core';
import { MatchDTO, MatchService } from 'src/app/@riotApi';
import { LoadingService } from 'src/app/@shared/loading/loading.service';
import { AuthenticationService } from 'src/app/@shared/services/authentication.service';
import { PlayerService } from 'src/app/@shared/services/player.service';

@Component({
  selector: 'app-dash-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  listMatch: MatchDTO[];
  fullHistory: MatchDTO[] = [];
  listIndex: number[];
  carregado: boolean = false;

  constructor(private playerService: PlayerService, private loadingService: LoadingService, private authService: AuthenticationService, private matchService: MatchService) { }

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
    this.loadingService.startLoadingBar();
    this.matchService.getCodigoPartidasTft(puuid, 10).subscribe(codigos => {

      console.log(codigos)
      let qtd = this.matchService.qtdPesquisa;
      console.log(qtd);

      while (codigos.length == (qtd - 1)) {
        codigos.pop();
        console.log(codigos.length, qtd)
      }

      if (qtd != 0 || this.matchService.historicoPartidas == null) {
        this.playerService.getHistory(codigos, puuid).subscribe(history => {
          this.fullHistory = this.matchService.setNewMatch(history);
          console.log(this.fullHistory, 1)
          this.carregado = true;
          this.loadingService.stopLoadingBar();
        });
      } else {
        this.fullHistory = this.matchService.historicoPartidas;
        console.log(this.fullHistory, 2)
        this.carregado = true;
        this.loadingService.stopLoadingBar();
      }
    }).add(() => {
      this.loadingService.stopLoadingBar();
    })
  }
}
