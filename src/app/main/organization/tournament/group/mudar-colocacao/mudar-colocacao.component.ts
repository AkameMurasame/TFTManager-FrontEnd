import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface FormularioColocacao {
  colocacao: number;
}

@Component({
  selector: 'app-mudar-colocacao',
  templateUrl: './mudar-colocacao.component.html',
  styleUrls: ['./mudar-colocacao.component.scss']
})
export class MudarColocacaoComponent implements OnInit {

  formulario!: FormGroup<FormularioColocacao>;

  private subscriptions: Subscription[] = [];
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private organizationService: OrganizationService,private dialogRef: MatDialogRef<MudarColocacaoComponent>, private fb: FormBuilder, private toastService: ToastService) { }

  ngOnInit() {
    this.montarFormulario();
  }

  montarFormulario() {
    this.formulario = this.fb.group({
      colocacao: [, [Validators.required]]
    });
  }
  onSubmit() {
    const _formulario = this.formulario.value;

    this.subscriptions.push(this.organizationService.redefinirColocacao(this.data.teamId, this.data.groupId, _formulario.colocacao).subscribe(tournament => {
      this.toastService.success("Colocação alterada com sucesso!");
      this.dialogRef.close();
    }));
  }
}
