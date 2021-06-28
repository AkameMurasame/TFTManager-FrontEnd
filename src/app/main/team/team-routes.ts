import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TeamDashboardComponent } from "./team-dashboard/team-dashboard.component";

const routes: Routes = [
    {
        path: "dashboard",
        component: TeamDashboardComponent,
        //canActivate: [AuthGuard],
        data: { permission: "" }
    },
    {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamRoutes { }