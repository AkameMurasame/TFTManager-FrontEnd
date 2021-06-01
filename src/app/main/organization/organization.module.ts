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

const MATERIAL = [
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule
]

@NgModule({
  declarations: [CadastroComponent, DashboardComponent, OrganizationComponent, AdicionarAdministradorComponent],
  imports: [
    CommonModule,
    OrganizationRoutes,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ...MATERIAL
  ]
})
export class OrganizationModule { }
