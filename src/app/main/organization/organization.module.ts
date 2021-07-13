import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroComponent } from './tournament/cadastro/cadastro.component';
import { OrganizationComponent } from './cadastro/organization.component';
import { OrganizationRoutes } from './organization-routes';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/@shared/shared.module';
import { AdicionarAdministradorComponent } from './admin/adicionar-administrador/adicionar-administrador.component';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TournamentDashboardComponent } from './tournament/dashboard/tournament-dashboard.component';

const MATERIAL = [
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  NgxMaterialTimepickerModule.setLocale('pt-BR'),
  MatExpansionModule
];

@NgModule({
  declarations: [CadastroComponent, DashboardComponent, OrganizationComponent, AdicionarAdministradorComponent, TournamentDashboardComponent],
  imports: [
    CommonModule,
    OrganizationRoutes,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ...MATERIAL
  ],
  providers: [
    MatDatepickerModule,
  ],
})
export class OrganizationModule { }
