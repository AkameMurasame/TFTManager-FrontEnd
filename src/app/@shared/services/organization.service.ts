import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { TeamStatus } from "../enum/teamStatus.enum";
import { AddAdmin } from "../models/organization/addAdmin";
import { Organization } from "../models/organization/organization";
import { RemoveAdmin } from "../models/organization/removeAdmin";
import { Player } from "../models/player/Player";
import { Stage } from "../models/tournament/stage";
import { Tournament } from "../models/tournament/tournament";

@Injectable({ providedIn: "root" })
export class OrganizationService {

    private organization: Organization;

    carregado: boolean = false;

    constructor(private http: ApiHttpClient) { }

    public get getOrganization(): Organization {
        return this.organization!;
    }

    organizationRegister(organization: Organization): Observable<Organization> {
        return this.http
            .post<Organization>(`organization/create`, organization)
            .pipe(
                map((organization: Organization) => {
                    this.organization = organization;
                    return organization;
                })
            );
    }

    getOrganizationByUserId(userId: number): Observable<Organization> {
        return this.http
            .get<Organization>(`organization/getOrganizationByUserId/${userId}`)
            .pipe(
                map((organization: Organization) => {
                    this.organization = organization;
                    return organization;
                })
            );
    }

    addAdmin(addAdmin: AddAdmin): Observable<Organization> {
        return this.http
            .post<Organization>(`organization/addAdmin`, addAdmin)
            .pipe(
                map((organization: Organization) => {
                    this.organization = organization;
                    return organization;
                })
            );
    }

    getOrganizationMenbers() {
        return this.http.get<Player[]>(`organization/getOrganizationMembers/${this.organization.id}`);
    }

    removeAdmin(removeAdmin: RemoveAdmin): Observable<Organization> {
        return this.http
            .post<Organization>(`organization/removeAdmin`, removeAdmin).pipe(
                map((organization: Organization) => {
                    this.organization = organization;
                    return organization;
                })
            );
    }

    getAllTorunamentByOrganization() {
        return this.http.get<Tournament[]>(`tournament/getAllTournamentsByOrganization/${this.organization.id}`);
    }

    setStatusTeamGroup(teamId: number, groupId: number, teamStatus: TeamStatus) {
        return this.http.put<void>(`organization/tournament/setStatusTeamGroup`, {
            groupId: groupId,
            teamId: teamId,
            teamStatus: teamStatus
        });
    }
}
