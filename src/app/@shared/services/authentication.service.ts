import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { UserJwt } from "../models/user/UserJwt";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserJwt>;
  public currentUser: Observable<UserJwt>;

  constructor(private http: ApiHttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserJwt>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserJwt {
    return this.currentUserSubject!.value;
  }

  login(params: any): Observable<UserJwt> {
    return this.http
      .post<any>(`auth/login`, params)
      .pipe(
        map((user) => {
          if (user && user.token) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject!.next(user);
          }
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject!.next(null);
  }

  checkPermission(permission: string | undefined): boolean {
    if (this.currentUserValue) {
      if (this.currentUserValue.user.role.nome == permission) {
        return true;
      }
    }
    return false;
  }
}
