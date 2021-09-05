import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TeamStatus } from 'src/app/@shared/enum/teamStatus.enum';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { ToastService } from 'src/app/@shared/services/toast.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  readonly dataSource = new MatTableDataSource<any>();

  readonly displayedColumns: string[] = ['Nome do Jogador', 'Acoes'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private organizationService: OrganizationService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.dataSource.data = this.data;
    console.log(this.data)
  }

  setStatusAusente(playerId: number, groupId: number) {
    this.organizationService.setStatusTeamGroup(playerId, groupId, TeamStatus.AUSENTE).subscribe(req => {
      this.toastService.success("Status alterado com sucesso!");
    });
  }

  setStatusDesistente(playerId: number, groupId: number) {
    this.organizationService.setStatusTeamGroup(playerId, groupId, TeamStatus.DESISTIU).subscribe(req => {
      this.toastService.success("Status alterado com sucesso!");
    });
  }
}
