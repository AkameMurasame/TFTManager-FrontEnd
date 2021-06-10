import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthenticationService } from "src/app/@shared/services/authentication.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    
    if (currentUser) {
      if (route.data.permission) {
        if (this.authenticationService.checkPermission(route.data.permission)) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    }

    this.router.navigate(["/"]);
    return false;
  }
}
