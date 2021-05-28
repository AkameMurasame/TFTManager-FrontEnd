import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerRoutes } from './player-routes';
import { RiotApiCore } from "src/app/@riotApi/index";
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule, PlayerRoutes, SharedModule
  ]
})
export class PlayerModule { }
