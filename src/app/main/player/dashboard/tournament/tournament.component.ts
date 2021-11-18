import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/@shared/loading/loading.service';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';
import { PlayerService } from 'src/app/@shared/services/player.service';

@Component({
  selector: 'app-dash-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {

  loaded: boolean = false;
  tournamentList: Tournament[] = [];

  constructor(private loadingService: LoadingService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.loadingService.startLocalLoading('.not-found');
    this.playerService.getTournamentsByPlayer().subscribe(tournaments => {
      console.log(tournaments)
      this.tournamentList = tournaments;
      this.loadingService.stopLocalLoading('.not-found');
      this.loaded = true;
    })
  }
}
