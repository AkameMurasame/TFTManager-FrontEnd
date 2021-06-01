import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/@shared/models/user/User';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { ToastService } from 'src/app/@shared/services/toast.service';

export interface FormularioAdmin {
  id: number;
}


@Component({
  selector: 'app-adicionar-administrador',
  templateUrl: './adicionar-administrador.component.html',
  styleUrls: ['./adicionar-administrador.component.scss']
})
export class AdicionarAdministradorComponent implements OnInit, OnDestroy {

  formulario!: FormGroup<FormularioAdmin>;

  private subscriptions: Subscription[] = [];

  constructor(private organizationService: OrganizationService, private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdicionarAdministradorComponent>, private toast: ToastService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit() {
    this.construirFormulario();
  }

  construirFormulario() {
    this.formulario = this.fb.group({
      id: [, [Validators.required]]
    });
  }

  onSubmit() {
    const _formulario = this.formulario.value;

    let user = new User();
    user.id = _formulario.id;

    let organization = this.organizationService.getOrganization;
    organization.organizatinoMembers.push(user);

    this.subscriptions.push(this.organizationService.addAdmin(organization).subscribe((result) => {
      this.toast.success("Administrador adicionado!");
      this.dialogRef.close();
    }));
  }
}
