import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InitComponent } from "./init.component";

const routes: Routes = [
  {
    path: "app",
    component: InitComponent,
  },
  {
    path: "player",
    loadChildren: () =>
      import('src/app/main/player/player.module').then((m) => m.PlayerModule),
  },
  {
    path: "organization",
    loadChildren: () =>
      import('src/app/main/organization/organization.module').then((m) => m.OrganizationModule),
  },
  {
    path: '', redirectTo: 'app', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutes { }
