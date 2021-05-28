import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/@core/interceptors/auth.guard";
import { ListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "list",
    component: ListComponent,
    canActivate: [AuthGuard],
    data: { permission: "" }
  },
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutes { }
