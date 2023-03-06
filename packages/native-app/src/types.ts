import { TableRow } from "@diplicity/common";

export type Query<T> = {
  data?: T | undefined;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

export interface GameSettingsTable {
  variant: TableRow<string>;
  phaseDeadline: TableRow<string>;
  nonMovementPhaseDeadline: TableRow<string>;
  gameEndYear: TableRow<number> | undefined;
}

export interface VariantSettingsTable {
  name: TableRow<string>;
  description: TableRow<string>;
  numPlayers: TableRow<number>;
  rules: TableRow<string>;
  startYear: TableRow<number>;
}

export interface ManagementSettingsTable {
  gameMaster: TableRow<string>;
  nationAllocation: TableRow<string>;
  visibility: TableRow<string>;
}

export interface PlayerSettingsTable {
  playerIdentity: TableRow<string>;
}

export interface GameLogTable {
  created: TableRow<string>;
  started?: TableRow<string>;
  finished?: TableRow<string>;
}
