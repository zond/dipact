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
  PrivateStats?: {
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

type FCMToken = {
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

export type UserConfig = {
  UserId?: string;
  FCMTokens?: FCMToken[];
  MailConfig?: {
    Enabled: boolean;
    UnsubscribeConfig: {
      RedirectTemplate: string;
      HTMLTemplate: string;
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

export type RootResponse = ApiResponse & {
  Properties: {
    User: User | null;
  };
};

export type UserBanResponse = ApiResponse & {
  Properties: Ban[];
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
