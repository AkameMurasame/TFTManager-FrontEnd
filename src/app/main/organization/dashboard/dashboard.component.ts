import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { OrganizationComponent } from '../cadastro/organization.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private organizationService: OrganizationService, private dialogService: MatDialog) { }

  ngOnInit() {
    console.log(this.verifyOrganization())
    if (!this.verifyOrganization()) {
      this.dialogService.open(OrganizationComponent).afterClosed().subscribe(result => {
        if(!this.verifyOrganization()) {
          //Notificação dizendo que ele não criou uma organização
          this.router.navigate(['player']);
        }
      });
    }
  }

  organization() {
    this.router.navigate(['organization/create']);
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
}
