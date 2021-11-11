import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  patch: string;
  location: Location;
  mobile_menu_visible: any = 0;

  constructor(
    location: Location, 
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthenticationService) {
    this.location = location;
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      let $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
    this.patch = this.router.url;
  }

  checkPermission(permission: string) {
    if (permission != "") {
      return this.authService.checkPermission(permission);
    }
    return true;
  }

  getAtualRoute() {
    this.route.url.subscribe(url => {
      for (let x = 0; x < url.length; x++) {
        if ((x + 1) === url.length) {
          console.log(url)
          this.patch = url[x]['path'].toLocaleLowerCase();
        }
      }
    });
  }
}
