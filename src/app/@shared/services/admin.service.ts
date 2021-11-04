import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { Organization } from "../models/organization/organization";

@Injectable({ providedIn: "root" })
export class AdminService {
    constructor(private http: ApiHttpClient) { }

    acceptOrganization(organizationId: number): Observable<void> {
        return this.http.post<any>(`admin/acceptOrganization`, {
            id: organizationId
        });
    }

    getOrganizacoesPendentes(): Observable<Organization[]> {
        return this.http.get<Organization[]>(`admin/getPendingsOrganizations`);
    }
}