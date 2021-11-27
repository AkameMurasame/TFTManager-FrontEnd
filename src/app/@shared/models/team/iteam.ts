import { GroupStatus } from "../../enum/groupStatus.enum";

export interface ITeam {
    groupId: number;
    id: number;
    name: String;
    groupStatus: GroupStatus;
    posicao: number;
}