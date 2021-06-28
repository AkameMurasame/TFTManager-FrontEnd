import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamRoutes } from './team-routes';
import { SharedModule } from 'src/app/@shared/shared.module';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input/';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroTeamComponent } from './cadastro-team/cadastro-team.component';

const MATERIAL = [
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatAutocompleteModule
]

@NgModule({
  declarations: [
    TeamDashboardComponent,
    CadastroTeamComponent
  ],
  imports: [
    CommonModule,
    TeamRoutes,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ...MATERIAL
  ]
})
export class TeamModule { }
