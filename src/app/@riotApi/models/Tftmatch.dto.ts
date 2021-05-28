export interface MatchDTO {
    /** Match metadata. */
    metadata: MetadataDTO;
    /** Match info. */
    info: InfoDTO;
}
export interface MetadataDTO {
    /** Match data version. */
    data_version: string;
    /** Match id. */
    match_id: string;
    /** A list of encrypted participant PUUIDs. */
    participants: string[];
}
export interface InfoDTO {
    /** Unix timestamp. */
    game_datetime: number;
    /** Game length in seconds. */
    game_length: number;
    /** Game variation key. Game variations documented in TFT static data. */
    game_variation?: string | null;
    /** Game client version. */
    game_version: string;
    /** Participants. */
    participants: ParticipantDTO[];
    /** Please refer to the League of Legends documentation. */
    queue_id: number;
    /** Teamfight Tactics set number. */
    tft_set_number: number;
}
export interface ParticipantDTO {
    /** Participant's companion. */
    companion: CompanionDTO;
    /** Gold left after participant was eliminated. */
    gold_left: number;
    /** The round the participant was eliminated in. Note: If the player was eliminated in stage 2-1 their last_round would be 5. */
    last_round: number;
    /** Participant Little Legend level. Note: This is not the number of active units. */
    level: number;
    /** Participant placement upon elimination. */
    placement: number;
    /** Number of players the participant eliminated. */
    players_eliminated: number;
    /** Encrypted PUUID. */
    puuid: string;
    /** The number of seconds before the participant was eliminated. */
    time_eliminated: number;
    /** Damage the participant dealt to other players. */
    total_damage_to_players: number;
    /** A complete list of traits for the participant's active units. */
    traits: TraitDTO[];
    /** A list of active units for the participant. */
    units: UnitDTO[];
}
export interface TraitDTO {
    /** Trait name. */
    name: string;
    /** Number of units with this trait. */
    num_units: number;
    /** Current style for this trait. (0 = No style, 1 = Bronze, 2 = Silver, 3 = Gold, 4 = Chromatic) */
    style?: number | null;
    /** Current active tier for the trait. */
    tier_current: number;
    /** Total tiers for the trait. */
    tier_total?: number | null;
}
export interface UnitDTO {
    /** A list of the unit's items. Please refer to the Teamfight Tactics documentation for item ids. */
    items: number[];
    /** This field was introduced in patch 9.22 with data_version 2. */
    character_id: string;
    /** Unit name. */
    name: string;
    /** Unit rarity. This doesn't equate to the unit cost. */
    rarity: number;
    /** Unit tier. */
    tier: number;
}
export interface CompanionDTO {
    skin_ID: number;
    content_ID: string;
    species: string;
}