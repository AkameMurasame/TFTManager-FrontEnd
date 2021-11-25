import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Subscription } from 'rxjs';
import { AddAdmin } from 'src/app/@shared/models/organization/addAdmin';
import { Player } from 'src/app/@shared/models/player/Player';
import { User } from 'src/app/@shared/models/user/User';
import { OrganizationService } from 'src/app/@shared/services/organization.service';
import { PlayerService } from 'src/app/@shared/services/player.service';
import { ToastService } from 'src/app/@shared/services/toast.service';

export interface FormularioAdmin {
  nickPlayer: number;
  nick: string;
}


@Component({
  selector: 'app-adicionar-administrador',
  templateUrl: './adicionar-administrador.component.html',
  styleUrls: ['./adicionar-administrador.component.scss']
})
export class AdicionarAdministradorComponent implements OnInit, OnDestroy {

  formulario!: FormGroup<FormularioAdmin>;

  private subscriptions: Subscription[] = [];

  playersPorNick!: Player[];

  constructor(private organizationService: OrganizationService, private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdicionarAdministradorComponent>, private toast: ToastService,
    private playerService: PlayerService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit() {
    this.construirFormulario();
  }

  onChangeNickName(nickName: string) {
    console.log(nickName)
  }

  construirFormulario() {
    this.formulario = this.fb.group({
      nickPlayer: [, [Validators.required]],
      nick: [, [Validators.required]],
    });

    /* this.formulario.controls.nick.valueChanges.subscribe(nick => {
      if (nick.length > 3) {
        this.playerService.getPlayersLike(nick).subscribe(players => {
          console.log(players)
          this.playersPorNick = players;
        })
      }
    }) */
  }

  onSubmit() {
    const _formulario = this.formulario.value;

    const addAdmin: AddAdmin = {
      displayName: _formulario.nick
    };
  
    console.log("Aqui", _formulario);

    this.subscriptions.push(this.organizationService.addAdmin(addAdmin).subscribe((result) => {
      this.toast.success("Administrador adicionado!");
      this.dialogRef.close();
    }));
  }
}
