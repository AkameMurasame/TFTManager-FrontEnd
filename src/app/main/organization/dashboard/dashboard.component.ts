import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Organization } from 'src/app/@shared/models/organization/organization';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { AdicionarAdministradorComponent } from '../admin/adicionar-administrador/adicionar-administrador.component';
import { OrganizationComponent } from '../cadastro/organization.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  organization: Organization;

  constructor(private router: Router, private organizationService: OrganizationService, private dialogService: MatDialog) { }

  ngOnInit() {
    console.log(this.verifyOrganization())
    if (!this.verifyOrganization()) {
      this.dialogService.open(OrganizationComponent).afterClosed().subscribe(result => {
        this.organization = this.organizationService.getOrganization;
        if (!this.verifyOrganization()) {
          //Notificação dizendo que ele não criou uma organização
          this.router.navigate(['player']);
        }
      });
    }
    this.organization = this.organizationService.getOrganization;
  }

  tournaments() {
    this.router.navigate(['organization/tournament']);
  }

  verifyOrganization(): boolean {
    if (this.organizationService.getOrganization == null) {
      return false;
    }
    return true;
  }

  adicionarAdministrador() {
    this.dialogService.open(AdicionarAdministradorComponent);
  }
}
