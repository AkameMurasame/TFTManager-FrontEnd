import { NgModule } from "@angular/core";
import { Routes, RouterModule, ExtraOptions } from "@angular/router";

const appRoutes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import('src/app/main/main.module').then((m) => m.MainModule),
  },
  { path: "**", redirectTo: "" },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
