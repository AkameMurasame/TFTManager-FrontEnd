import { GroupStatus } from "../../enum/groupStatus.enum";

export interface Group {
    groupId: number;
    stageId: number;
    id: number;
    name: String;
    idPartida: String;
    capitain: number;
    teamType: String;
    logo: String;
    groupStatus: GroupStatus;
    posicao: number;
}