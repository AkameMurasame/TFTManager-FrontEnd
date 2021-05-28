import { Component, OnInit } from '@angular/core';
import { Player } from '../../models/player/Player';
import { AuthenticationService } from '../../services/authentication.service';
import { DataDragonService } from '../../services/data-dragon.service';
import { LcuService } from '../../services/lcu.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  permission: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/player', title: 'Dashboard', icon: 'dashboard', class: '', permission: "" },
  //{ path: '/user-profile', title: 'Perfil',  icon:'person', class: '' },
  { path: '/organization', title: 'Organização', icon: 'content_paste', class: '', permission: "ORGANIZATION" },
  { path: '/tournament', title: 'Torneios', icon: 'library_books', class: '', permission: "" },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: any[] = [];
  player: Player = new Player();
  urlIcon: string = "";

  constructor(private lcuService: LcuService, private dataDragonService: DataDragonService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.player = this.lcuService.lcuPlayer;
    this.urlIcon = this.dataDragonService.getUrlProfileIcon(this.player.profileIconId);

  }

  checkPermission(permission: string) {
    if (permission != "") {
      return this.authService.checkPermission(permission);
    }
    return true;
  }

  isMobileMenu() {
    return false;
  };
}
