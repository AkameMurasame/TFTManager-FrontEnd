import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from '../../../@shared/models/tournament/tournament';
import { TournamentService } from '../../../@shared/services/tournament.service';
import { PlayerService } from '../../../@shared/services/player.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  tournamentId: number;
  tournament: Tournament;
  battlefyData: any;

  constructor(private activeRoute: ActivatedRoute, private tournamentService: TournamentService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.tournamentId = this.activeRoute.snapshot.params.tournamentId;
    this.getTournament();
  }

  getTournament() {
    this.tournamentService.getTournamentById(this.tournamentId).subscribe(tournament => {
      this.tournament = tournament;
      if (tournament.battlefyLink != "") {
        this.tournamentService.getBattlefyTournament(tournament.battlefyId).subscribe(bt => {
          console.log(bt);
          //bt.rules.complete.replace("COMPLETO", " ");
          this.battlefyData = bt;
        })
      }
    })
  }

  entryTournament() {
    this.tournamentService.entryTournament(this.tournamentId, this.playerService.getPlayer.id).subscribe(entry => {
      let teste = 0;
    });
  }
}
