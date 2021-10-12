import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerRoutes } from './player-routes';
import { SharedModule } from 'src/app/@shared/shared.module';
import { TournamentComponent } from './dashboard/tournament/tournament.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatchComponent } from './dashboard/match/match.component';
import { HistoryComponent } from './dashboard/history/history.component';

@NgModule({
  declarations: [DashboardComponent, TournamentComponent, MatchComponent, HistoryComponent],
  imports: [
    CommonModule, PlayerRoutes, SharedModule, MatTabsModule
  ]
})
export class PlayerModule { }
