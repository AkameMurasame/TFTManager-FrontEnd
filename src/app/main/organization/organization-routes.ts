import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/@core/interceptors/auth.guard";
import { RoleEnum } from "src/app/@shared/enum/role.enum";
import { OrganizationComponent } from "./cadastro/organization.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CadastroComponent } from "./tournament/cadastro/cadastro.component";
import { TournamentDashboardComponent } from "./tournament/dashboard/tournament-dashboard.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { permission: RoleEnum.ORGANIZATION }
  },
  {
    path: "create",
    component: OrganizationComponent,
    canActivate: [AuthGuard],
    data: { permission: RoleEnum.ORGANIZATION }
  },
  {
    path: "tournament",
    component: CadastroComponent,
    canActivate: [AuthGuard],
    data: { permission: RoleEnum.ORGANIZATION }
  },
  {
    path: "tournament/dashboard/:tournamentId",
    component: TournamentDashboardComponent,
    canActivate: [AuthGuard],
    data: { permission: RoleEnum.ORGANIZATION }
  },
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutes { }
