import { OrganizationStatusEnum } from "../../enum/organizationStatus.enum";
import { User } from "../user/User";

export interface Organization {
    id?: number;
    linkLastTournemant?: String;
    name?: string;
    shortDescription?: string;
    bannerUrl?: string;
    logoUrl?: string;
    organizatinoMembers?: User[];
    organizationStatus?: OrganizationStatusEnum;
}