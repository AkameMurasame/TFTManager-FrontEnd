import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";


@Injectable({ providedIn: "root" })
export class MatchService {
    constructor(private http: ApiHttpClient) { }

    matchResult(groupId: number): Observable<any> {
        return this.http.post<any>(`match/matchResult`, {
            groupId: groupId
        });
    }
}