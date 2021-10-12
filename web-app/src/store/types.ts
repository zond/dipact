type Edge = {
  Flags: {
    [key: string]: boolean;
  };
};

type Link = {
  Rel: string;
  URL: string;
  Method: string;
  JSONschema: string; // TODO
};

type Unit = {
  Type: string;
  Nation: string;
};

type Sub = {
  Name: string;
  Edges: { [key: string]: Edge };
  ReverseEdges: { [key: string]: Edge };
  Flags: {
    [key: string]: boolean;
  };
};

type Node = {
  Name: string;
  Subs: { [key: string]: Sub };
  SC: string;
};

type Graph = {
  Nodes: { [key: string]: Node };
};

type Start = {
  Year: number;
  Season: string;
  Type: string;
  SCs: { [key: string]: string };
  Units: { [key: string]: Unit };
  Map: string;
  Graph: Graph;
};

export type Variant = {
  Name: string;
  Nations: string[];
  PhaseTypes: string[];
  Season: string[];
  UnitTypes: string[];
  SvgVersion: string;
  ProvinceLongNames: { [key: string]: string };
  NationColors: null | { [key: string]: string };
  CreatedBy: string;
  Version: string;
  Description: string;
  Rules: string;
  OrderTypes: string[];
  nationAbbreviations: { [key: string]: string };
  Start?: Start;
  Links: Link[] | null;
};

export type VariantResponse = ApiResponse & {
  Properties: Variant;
};

export type User = {
  Email?: string;
  FamilyName?: string;
  Gender?: string;
  GivenName?: string;
  Hd?: string;
  Id?: string;
  Link?: string;
  Locale?: string;
  Name?: string;
  Picture?: string;
  VerifiedEmail?: boolean;
  ValidUntil?: string;
};

type TrueSkill = {
  GameID: null;
  UserId: string;
  CreatedAt: string;
  Member: string;
  Mu: number;
  Sigma: number;
  Rating: number;
  Previous: null;
  HigherRatedCount: number;
};

export type PrivateStats = {
  JoinedGames: number;
  StartedGames: number;
  FinishedGames: number;
  SoloGames: number;
  DIASGames: number;
  EliminatedGames: number;
  DroppedGames: number;
  NMRPhases: number;
  ActivePhases: number;
  ReadyPhases: number;
  Reliability: number;
  Quickness: number;
  OwnedBans: number;
  SharedBans: number;
  Hated: number;
  Hater: number;
};

export type UserStats = {
  UserId?: string;
  JoinedGames?: number;
  StartedGames?: number;
  FinishedGames?: number;
  SoloGames?: number;
  DIASGames?: number;
  EliminatedGames?: number;
  DroppedGames?: number;
  NMRPhases?: number;
  ActivePhases?: number;
  ReadyPhases?: number;
  Reliability?: number;
  Quickness?: number;
  OwnedBans?: number;
  SharedBans?: number;
  Hated?: number;
  Hater?: number;
  PrivateStats?: PrivateStats;
  TrueSkill?: TrueSkill;
  User?: User;
};

type FCMTokenConfig = {
  ClickActionTemplate: string;
  TitleTemplate: string;
  BodyTemplate: string;
  DontSendData: boolean;
  DontSendNotification: boolean;
};

export type Message = {
  ID: string;
  GameID: string;
  ChannelMembers: string[];
  Sender: string;
  Body: string;
  CreatedAt: string;
  Age: number;
};

export type MessageResponse = ApiResponse & {
  Properties: Message;
};

export type ListMessagesResponse = ApiResponse & {
  Properties: MessageResponse[];
};

export type FCMToken = {
  Value: string;
  Disabled: boolean;
  Note: string;
  App: string;
  MessageConfig: FCMTokenConfig;
  PhaseConfig: FCMTokenConfig;
  ReplaceToken: string;
};

type TemplateConfig = {
  SubjectTemplate: string;
  TextBodyTemplate: string;
  HTMLBodyTemplate: string;
};

export type ColorOverrides = {
  nationCodes: { [key: string]: string };
  variantCodes: { [key: string]: string };
  positions: string[];
  variants: { [key: string]: { [key: string]: string } };
  nations: { [key: string]: string };
};

export type UserConfig = {
  UserId?: string;
  FCMTokens?: FCMToken[];
  MailConfig?: {
    Enabled?: boolean;
    UnsubscribeConfig?: {
      RedirectTemplate: string;
      HTMLTemplate: string;
    };
    MessageConfig?: {
      TextBodyTemplate: string;
    };
    PhaseConfig?: {
      TextBodyTemplate: string;
    };
  };
  MessageConfig?: TemplateConfig;
  PhaseConfig?: TemplateConfig;
  Colors?: null | string[];
  PhaseDeadlineWarningMinutesAhead?: number;
};

export type Ban = {
  UserIds: string[];
  OwnerIds: string[];
  Users: User[];
};

export type ForumMail = {
  Body?: string;
  Secret?: string;
  Subject?: string;
};

type ApiResponse = {
  Name: string;
  Type: string;
  Desc?: string[][];
  Links: Link[] | null;
};

export type Root = {
  User: User | null;
}

export type RootResponse = ApiResponse & {
  Properties: Root;
};

export type BanResponse = ApiResponse & {
  Properties: Ban;
};

export type UserBanResponse = ApiResponse & {
  Properties: BanResponse[];
  userId?: string;
};

export type UserConfigResponse = ApiResponse & {
  Properties: UserConfig;
};

export type UserStatsResponse = ApiResponse & {
  Properties: UserStats;
};

export type UserRatingHistogramResponse = ApiResponse & {
  Properties: {
    FirstBucketRating: number;
    Counts: number[];
  };
};

export type ListVariantsResponse = ApiResponse & {
  Properties: VariantResponse[];
};

export type ForumMailResponse = ApiResponse & {
  Properties: ForumMail;
};

export type Auth = {
  token?: string;
  isLoggedIn: boolean;
};

export enum Headers {
  Authorization = "authorization",
  Accept = "Accept",
  XDiplicityAPILevel = "X-Diplicity-API-Level",
  XDiplicityClientName = "X-Diplicity-Client-Name",
}

export type NewGame = {
  Anonymous: boolean;
  ChatLanguageISO639_1: string;
  Desc: string;
  DisableConferenceChat: boolean;
  DisableGroupChat: boolean;
  DisablePrivateChat: boolean;
  GameMasterEnabled: boolean;
  LastYear: number;
  MaxHated: number;
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

export type PhaseState = {
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

export type Member = {
  User: User;
  Nation: string;
  GameAlias: string;
  NationPreferences: string;
  UnreadMessages: number;
  Replacable: boolean;
  NewestPhaseState: PhaseState;
};

export type Game = NewGame & {
  Closed: boolean;
  Finished: boolean;
  ID: string;
  Mustered: boolean;
  NoMerge: boolean;
  Started: boolean;
  GameMasterInvitations: null;
  GameMaster: User;
  NMembers: number;
  Members: Member[];
  StartETA: string;
  NewestPhaseMeta: null;
  ActiveBans: null;
  FailedRequirements: null;
  FirstMember: Member;
  CreatedAt: string;
  CreatedAgo: string;
  StartedAt: string;
  StartedAgo: string;
  FinishedAt: string;
  FinishedAgo: string;
};

export type UnitState = {
  Province: string;
  Unit: Unit;
};

export type SCState = {
  Province: string;
  Owner: string;
};

export type Resolution = {
	Province: string,
	Resolution: string,
}

export type PreliminaryScore = {
	UserId: string;
	Member: string;
	SCs: number;
	Score: number;
	Explanation: string;
}

export type Bounce = {
	Province: string;
	BounceList: string;
}

export type Dislodged = {
	Province: string;
	Dislodged: Unit;
}

export type Dislodger = {
	Province: string;
	Dislodger: string;
}

export type Phase = {
  PhaseOrdinal: number;
  Season: string;
  Year: number;
  Type: string;
  Resolved: boolean;
  CreatedAt: string;
  CreatedAgo: number;
  ResolvedAt: string;
  ResolvedAgo: number;
  DeadlineAt: string;
  NextDeadlineIn: number;
  UnitsJSON: string;
  SCsJSON: string;
  GameID: string;
  Units: UnitState[];
  SCs: SCState[];
  Dislodgeds: null | Dislodged[];
  Dislodgers: null | Dislodger[];
  ForceDisbands: null | string[];
  Bounces: null | Bounce[];
  Resolutions: null | Resolution[];
  Host: string;
  SoloSCCount: number;
  PreliminaryScores: PreliminaryScore[];
};

export type PhaseStateResponse = ApiResponse & {
  Properties: PhaseState;
};

export type ListPhaseStatesResponse = ApiResponse & {
  Properties: PhaseStateResponse[];
};

export type PhaseResponse = ApiResponse & {
  Properties: Phase;
};

export type ListPhasesResponse = ApiResponse & {
  Properties: PhaseResponse[];
};

export type GameResponse = ApiResponse & {
  Properties: Game;
};

export type CreateGameResponse = ApiResponse & {
  Properties: Game;
  userId?: string;
};

export type UpdateUserConfigResponse = ApiResponse & {
  Properties: UserConfig;
};

export type HasPermissionType = "unknown" | "true" | "false";
export type TargetStateType = "undefined" | "enabled" | "disabled";

export type Messaging = {
  hasPermission: HasPermissionType;
  hasToken: boolean;
  globalToken?: FCMToken;
  targetState: TargetStateType;
  token: string | null;
  tokenApp: string;
  tokenEnabled: boolean;
  tokenOnServer: boolean;
};

export interface ColorMap {
  [key: string]: {
    name: string;
    color: string;
    edited: boolean;
  }[];
}

export interface SettingsFormValues {
  colors: { [key: string]: { [key: string]: string } };
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  phaseDeadline: number;
}

export type Channel = {
 GameID: string,
 Members: string[],
 NMessages: number,
 LatestMessage: Message,
 NMessagesSince?: {
   Since: string,
   NMessages: number,
 },
}

export type ChannelResponse = ApiResponse & {
  Properties: Channel;
}

export type ListChannelsResponse = ApiResponse & {
  Properties: ChannelResponse[];
}

export enum Severity {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Success = "success",
}

export interface Feedback {
  id: number;
  severity: Severity;
  message: string;
}

export interface MutationStatus {
  isLoading: boolean;
  isError: boolean;
}

export type CreateMessageResponse = ApiResponse & {
  Properties: Message
}
