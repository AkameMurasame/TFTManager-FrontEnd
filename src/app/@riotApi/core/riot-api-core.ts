import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class RiotApiCore {
    constructor(private http: HttpClient) { }

    public get<T>(endPoint: string, platform: string): Observable<T> {
        return this.http.get<T>(`https://${platform}${environment.riotApiEndPont}${endPoint}`);
    }

    public post<T>(endPoint: string, params: Object, platform: string): Observable<T> {
        return this.http.post<T>(`https://${platform}${environment.riotApiEndPont}${endPoint}`, params);
    }
}