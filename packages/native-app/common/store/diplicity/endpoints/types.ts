export type DiplicityApiGame = Omit<DiplicityApiNewGame, "FirstMember"> & {
  ActiveBans: null;
  Closed: boolean;
  CreatedAgo: number;
  CreatedAt: string;
  FailedRequirements: null | string[];
  Finished: boolean;
  FinishedAgo: number;
  FinishedAt: string;
  FirstMember: DiplicityApiMember;
  GameMaster: User;
  GameMasterInvitations: null | DiplicityApiGameMasterInvitation[];
  ID: string;
  Members: DiplicityApiMember[];
  Mustered: boolean;
  NMembers: number;
  NewestPhaseMeta: PhaseMeta[] | null;
  NoMerge: boolean;
  StartETA: string;
  Started: boolean;
  StartedAgo: number;
  StartedAt: string;
};

export type DiplicityApiGameMasterInvitation = {
  Email: string;
  Nation: string;
};

type DiplicityApiLink = {
  Rel: string;
  URL: string;
  Method: string;
  JSONschema: string; // TODO
};

export type DiplicityApiMember = {
  User: DiplicityApiUser;
  Nation: string;
  GameAlias: string;
  NationPreferences: string;
  UnreadMessages: number;
  Replacable: boolean;
  NewestPhaseState: DiplicityApiPhaseState;
};

export type DiplicityApiNewGame = {
  Anonymous: boolean;
  ChatLanguageISO639_1: string;
  Desc: string;
  DisableConferenceChat: boolean;
  DisableGroupChat: boolean;
  DisablePrivateChat: boolean;
  FirstMember?: Pick<DiplicityApiMember, "NationPreferences">;
  GameMasterEnabled: boolean;
  LastYear: number;
  MaxHated: number | null;
  MaxHater: number;
  MaxRating: number;
  MinQuickness: number;
  MinRating: number;
  MinReliability: number;
  NationAllocation: number;
  NonMovementPhaseLengthMinutes: number;
  PhaseLengthMinutes: number;
  Private: boolean;
  RequireGameMasterInvitation: boolean;
  SkipMuster: boolean;
  Variant: string;
};

export type DiplicityApiPhaseMeta = {
  PhaseOrdinal: number;
  Season: string;
  Year: number;
  Type: string;
  Resolved: false;
  CreatedAt: string;
  CreatedAgo: number;
  ResolvedAt: string;
  ResolvedAgo: number;
  DeadlineAt: string;
  NextDeadlineIn: number;
  UnitsJSON: string;
  SCsJSON: string;
};

export type DiplicityApiPhaseState = {
  GameID: string;
  PhaseOrdinal: number;
  Nation: string;
  ReadyToResolve: boolean;
  WantsDIAS: boolean;
  WantsConcede: boolean;
  OnProbation: boolean;
  NoOrders: boolean;
  Eliminated: boolean;
  Messages: string;
  ZippedOptions: null;
  Note: string;
};

export interface DiplicityApiResponse<P> {
  Properties: P;
  Name: string;
  Type: string;
  Desc?: string[][];
  Links: DiplicityApiLink[] | null;
}

export type DiplicityApiUser = {
  Email: string;
  FamilyName: string;
  Gender: string;
  GivenName: string;
  Hd: string;
  Id: string;
  Link: string;
  Locale: string;
  Name: string;
  Picture: string;
  VerifiedEmail: boolean;
  ValidUntil: string;
};

export type CreateGameFormValues = {
  adjustmentPhaseLengthMultiplier: number;
  adjustmentPhaseLengthUnit: number;
  anonymousEnabled: boolean;
  chatLanguage: string;
  conferenceChatEnabled: boolean;
  customAdjustmentPhaseLength: boolean;
  endAfterYears: boolean;
  endAfterYearsValue: number;
  gameMaster: boolean;
  groupChatEnabled: boolean;
  individualChatEnabled: boolean;
  maxRating: number;
  maxRatingEnabled: boolean;
  minQuickness: number;
  minRating: number;
  minRatingEnabled: boolean;
  minReliability: number;
  name: string;
  nationAllocation: string;
  phaseLengthMultiplier: number;
  phaseLengthUnit: number;
  privateGame: boolean;
  quicknessEnabled: boolean;
  reliabilityEnabled: boolean;
  requireGameMasterInvitation: boolean;
  skipGetReadyPhase: boolean;
  variant: string;
};

export type DislodgingProvinces = {
  province: string;
  dislodgingProvince: string;
};

export type DislodgedUnit = {
  province: string;
  unit: Unit;
};

export enum NationAllocation {
  Random = "Random",
  Preference = "Preference",
}

export type Player = {};

export type Game = {
  anonymous: boolean;
  chatDisabled: boolean;
  chatLanguage: string;
  chatLanguageDisplay: string;
  closed: boolean;
  conferenceChatEnabled: boolean;
  confirmationStatus: "confirmed" | "notConfirmed" | "nmr" | undefined;
  createdAt: string;
  deadline: string;
  endYear: number;
  finished: boolean;
  finishedAt: string;
  gameMaster: Player | undefined;
  groupChatEnabled: boolean;
  id: string;
  name: string;
  nationAllocation: NationAllocation;
  newestPhaseMeta: PhaseMeta[] | null;
  nonMovementPhaseLength: string;
  numPlayers: number;
  phaseLength: string;
  phaseSummary: string;
  playerIdentity: "anonymous" | "public";
  players: Player[];
  privateChatEnabled: boolean;
  privateGame: boolean;
  rulesSummary: string;
  started: boolean;
  startedAt: string;
  status: "staging" | "started" | "finished";
  userIsPlayer: (user: User) => boolean;
  userIsGameMaster: (user: User) => boolean;
  variant: string;
  visibility: "private" | "public";
};

export type Phase = {
  id: number;
  season: string;
  year: number;
  type: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt: string;
  deadlineAt: string;
  units: UnitState[];
  supplyCenters: SupplyCenterState[];
  dislodgedUnits: DislodgedUnit[];
  dislodgingProvinces: DislodgingProvinces[];
};

export type PhaseMeta = Omit<Phase, "dislogedUnits" | "dislodgingProvinces">;

export type Unit = {
  type: string;
  nation: string;
};

export type UnitState = {
  province: string;
  unit: Unit;
};

export type SupplyCenterState = {
  province: string;
  owner: string;
};

export type User = {
  id: string;
  src: string;
  username: string;
};
