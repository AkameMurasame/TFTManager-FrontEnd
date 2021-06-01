import { User } from "../user/User";

export interface Organization {
    id?: number;
    name: String;
    logo: String;
    organizatinoMembers?: User[];
}