import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";

const routes: Routes = [
    {
        path: "dashboard",
        component: AdminDashboardComponent,
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
export class AdminRoutes { }