import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Organization } from 'src/app/@shared/models/organization/organization';
import { Player } from 'src/app/@shared/models/player/Player';
import { AuthenticationService } from 'src/app/@shared/services/authentication.service';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { AdicionarAdministradorComponent } from '../admin/adicionar-administrador/adicionar-administrador.component';
import { OrganizationComponent } from '../cadastro/organization.component';
import { MatTableDataSource } from '@angular/material/table';
import { RemoveAdmin } from 'src/app/@shared/models/organization/removeAdmin';
import { CadastroComponent } from '../tournament/cadastro/cadastro.component';
import { Tournament } from 'src/app/@shared/models/tournament/tournament';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  organization: Organization;

  readonly dataSource = new MatTableDataSource<Player>();

  readonly displayedColumns: string[] = ['Nick', 'Acoes'];

  readonly dataSourceTournament = new MatTableDataSource<Tournament>();

  readonly displayedColumnsTournament: string[] = ['Nome', 'Data', 'Hora', "qtdPlayer", "qtdPlayerTeam", "Acoes"];

  constructor(private router: Router, private organizationService: OrganizationService,
    private dialogService: MatDialog, private authService: AuthenticationService, private toastService: ToastService) { }

  ngOnInit() {
    if (this.organizationService.getOrganization == null) {
      this.organizationService.getOrganizationByUserId(this.authService.currentUserValue.user.id).subscribe(org => {
        if (org != null) {
          this.organization = this.organizationService.getOrganization;
          this.popularTabelas();
        } else {
          this.dialogService.open(OrganizationComponent).afterClosed().subscribe(result => {
            this.organization = this.organizationService.getOrganization;
            if (this.organization == null) {
              this.toastService.error("Conclua o cadastro de organização!")
              this.router.navigate(['player']);
            } else {
              this.popularTabelas();
            }
          });
        }
      });
    } else {
      this.organization = this.organizationService.getOrganization;
      this.popularTabelas();
    }
  }

  popularTabelas() {
    this.organizationService.getOrganizationMenbers().subscribe(menbers => {
      this.dataSource.data = menbers;
    });

    this.organizationService.getAllTorunamentByOrganization().subscribe(tournaments => {
      console.log(tournaments)
      this.dataSourceTournament.data = tournaments;
    });
  }

  novoCampeonato() {
    this.dialogService.open(CadastroComponent);
  }

  removerAdmin(player) {
    const removeAdmin: RemoveAdmin = {
      organizationId: this.organization.id,
      playerId: player
    };

    this.organizationService.removeAdmin(removeAdmin).subscribe(org => {
      this.toastService.success("Administrador removido com sucesso!");
    });
  }

  adicionarAdministrador() {
    this.dialogService.open(AdicionarAdministradorComponent);
  }

  detalhesTournament(idTournament: number) {
    this.router.navigate(['/organization/tournament/dashboard/' + idTournament]);
  }
}
