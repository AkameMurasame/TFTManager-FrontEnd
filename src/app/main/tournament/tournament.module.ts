import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { TournamentRoutes } from './tournament-routes';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ViewComponent } from './view/view.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [ListComponent, ViewComponent],
  imports: [
    CommonModule, TournamentRoutes, SharedModule, MatTabsModule
  ]
})
export class TournamentModule { }
