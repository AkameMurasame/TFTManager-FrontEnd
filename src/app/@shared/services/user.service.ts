import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { Player } from "../models/player/Player";
import { User } from "../models/user/User";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: ApiHttpClient) {}

  userRegister(user: User): Observable<User> {
    return this.http
      .post<User>(`auth/register`, user)
      .pipe(
        map((usuario) => {
          return usuario;
        })
      );
  }

  getUserByName(username: String) {
    return this.http
      .get<User>(`auth/getUserByName/${username}`)
      .pipe(
        map((usuario) => {
          return usuario;
        })
      );
  }

  getPlayerByNick(nickName: string): Observable<Player> {
    return this.http.get<Player>(`auth/getPlayerByNickname/${nickName}`);
  }

  updateUser(user: User, userId: number): Observable<void> {
    return this.http.put<void>(`auth/update`, {
      user: user,
      userId: userId,
      key: ""
    });
  }
}
