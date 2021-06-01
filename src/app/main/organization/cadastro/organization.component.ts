import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Organization } from 'src/app/@shared/models/organization/organization';
import { OrganizationService } from 'src/app/@shared/services/organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit, OnDestroy {

  formulario!: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(private organizationService: OrganizationService, private router: Router, private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrganizationComponent>) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit() {
    this.construirFormulario();
  }

  construirFormulario() {
    this.formulario = this.fb.group({
      nomeOrganizacao: ['', [Validators.required]],
      linkLogo: ['', [Validators.required]]
    });
  }

  onSubmit() {
    const _formulario = this.formulario.value;

    const request: Organization = {
      name: _formulario.nomeOrganizacao,
      logo: _formulario.linkLogo
    };

    this.subscriptions.push(this.organizationService.organizationRegister(request).subscribe(organization => {
      //notificação para sucesso
      this.dialogRef.close();
    }));
  }
}
