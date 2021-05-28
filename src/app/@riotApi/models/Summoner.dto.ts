export interface SummonerDTO {
    /** Encrypted account ID. Max length 56 characters. */
    accountId: string;
    /** ID of the summoner icon associated with the summoner. */
    profileIconId: number;
    /** Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: summoner name change, summoner level change, or profile icon change. */
    revisionDate: number;
    /** Summoner name. */
    name: string;
    /** Encrypted summoner ID. Max length 63 characters. */
    id: string;
    /** Encrypted PUUID. Exact length of 78 characters. */
    puuid: string;
    /** Summoner level associated with the summoner. */
    summonerLevel: number;
}