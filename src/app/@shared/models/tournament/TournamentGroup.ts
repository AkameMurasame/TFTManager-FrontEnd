import { GroupStatus } from "../../enum/groupStatus.enum";

export interface TournamentGroup {
    stageI: number;

    id: number

    idPartida: string

    qtdPlayers: number;

    groupStatus: GroupStatus;
}