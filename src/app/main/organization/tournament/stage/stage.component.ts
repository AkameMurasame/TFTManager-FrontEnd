import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { TournamentGroup } from 'src/app/@shared/models/tournament/TournamentGroup';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TournamentService } from 'src/app/@shared/services/tournament.service';
import { GroupComponent } from '../group/group.component';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

  @Input('stage') stage: number;

  groups: TournamentGroup[] = [];

  constructor(private tournamentService: TournamentService,
    private toastService: ToastService,
    private dialogService: MatDialog) { }

  ngOnInit(): void {
    this.tournamentService.getGroupsByStageId(this.stage).subscribe(groups => {
      this.groups = groups;
    })
  }

  generateStagetxt(stageId) {
    this.tournamentService.generateTxt(stageId).subscribe(res => {
      saveAs(res, "tabela.txt")
      this.toastService.success("Tabela Salva!");
    })
  }

  detalhesGroup(groupId, numeroGroup, groupStatus) {
    this.dialogService.open(GroupComponent, {
      data: { "groupId": groupId, "numeroGroup": numeroGroup, "groupStatus": groupStatus },
      height: "90%",
      width: "90%"
    });
  }
}
