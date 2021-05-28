import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitComponent } from './init.component';
import { MainRoutes } from './main-routes';
import { SharedModule } from '../@shared/shared.module';
import { PlayerModule } from './player/player.module';
import { RiotApiCore } from "src/app/@riotApi/index";
import { OrganizationModule } from './organization/organization.module';

@NgModule({
  declarations: [InitComponent],
  imports: [
    CommonModule, MainRoutes, SharedModule, PlayerModule, OrganizationModule
  ],
  providers: [RiotApiCore]
})
export class MainModule { }
