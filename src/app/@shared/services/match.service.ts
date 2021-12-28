import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { GroupStatus } from "../enum/groupStatus.enum";


@Injectable({ providedIn: "root" })
export class MatchService {
    constructor(private http: ApiHttpClient) { }

    matchResult(groupId: number): Observable<any> {
        return this.http.post<any>(`match/matchResult`, {
            groupId: groupId
        });
    }

    organizationMatchResult(groupId: number, nick: string): Observable<any> {
        const formData = new FormData();
        formData.append("groupId", groupId.toString());
        formData.append("playerName", nick)

        return this.http.post<any>(`match/organizationMatchResult`, formData);
    }

    changeMatchStatus(groupId: number, status: GroupStatus) {
        return this.http.post<any>(`match/changeMatchStatus`, {
            groupId: groupId,
            groupStatus: status
        })
    }

    wo(groupId: number): Observable<any> {
        return this.http.post<any>(`match/setWoResult`, {
            groupId: groupId
        });
    }
}