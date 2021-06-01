import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { Organization } from "../models/organization/organization";

@Injectable({ providedIn: "root" })
export class OrganizationService {

    private organization: Organization;

    constructor(private http: ApiHttpClient) { }

    public get getOrganization(): Organization {
        return this.organization!;
    }

    organizationRegister(organization: Organization): Observable<Organization> {
        return this.http
            .post<Organization>(`organization/create`, organization)
            .pipe(
                map((organization) => {
                    this.organization = organization;
                    return organization;
                })
            );
    }

    getOrganizationByUserId(userId: number): Observable<Organization> {
      return this.http
      .get<Organization>(`organization/getOrganizationByUserId/${userId}`)
      .pipe(
          map((organization) => {
            console.log(organization)
              this.organization = organization;
              return organization;
          })
      );
    }

    addAdmin(organization: Organization) : Observable<Organization> {
        return this.http
            .post<Organization>(`organization/addAdmin`, organization)
            .pipe(
                map((organization) => {
                    this.organization = organization;
                    return organization;
                })
            );
    }
}
