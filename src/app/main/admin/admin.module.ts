import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamRoutes } from '../team/team-routes';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SharedModule } from 'src/app/@shared/shared.module';



@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    TeamRoutes,
    SharedModule
  ]
})
export class AdminModule { }
