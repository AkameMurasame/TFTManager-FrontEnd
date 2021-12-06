import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/@shared/loading/loading.service';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';
import { TournamentService } from 'src/app/@shared/services/tournament.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  tournaments: Tournament[];

  constructor(private tournamentService: TournamentService, private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.startLoadingBar();
    this.tournamentService.getAllTournamentsJogaveis().subscribe(tournaments => {
      this.tournaments = tournaments;
      console.log(this.tournaments)
      this.loadingService.stopLoadingBar();
    });
  }
}
