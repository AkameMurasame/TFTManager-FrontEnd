import { Component, OnInit } from '@angular/core';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';
import { PlayerService } from 'src/app/@shared/services/player.service';

@Component({
  selector: 'app-dash-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {

  tournamentList: Tournament[];

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.playerService.getTournamentsByPlayer().subscribe(tournaments => {
      console.log(tournaments)
      this.tournamentList = tournaments;
    })
  }
}
