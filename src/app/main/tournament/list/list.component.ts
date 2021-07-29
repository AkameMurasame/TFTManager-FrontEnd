import { Component, OnInit } from '@angular/core';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';
import { TournamentService } from 'src/app/@shared/services/tournament.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  tournaments: Tournament[];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.tournamentService.getAllTournamentsJogaveis().subscribe(tournaments => {
      this.tournaments = tournaments;
      console.log(this.tournaments)
    });
  }
}
