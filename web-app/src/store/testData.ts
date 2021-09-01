import { RootState } from "./store";
import {
	CreateGameResponse,
	Game,
	ListVariantsResponse,
	Member,
	Messaging,
	NewGame,
	PhaseState,
	PrivateStats,
	User,
	UserConfig,
	UserConfigResponse,
	Variant,
	VariantResponse,
} from "./types";
import { TagType } from "./service";

export const privateStats: PrivateStats = {
	JoinedGames: 0,
	StartedGames: 0,
	FinishedGames: 0,
	SoloGames: 0,
	DIASGames: 0,
	EliminatedGames: 0,
	DroppedGames: 0,
	NMRPhases: 0,
	ActivePhases: 0,
	ReadyPhases: 0,
	Reliability: 0,
	Quickness: 0,
	OwnedBans: 0,
	SharedBans: 0,
	Hated: 0,
	Hater: 0,
};

export const variant: Variant = {
	Name: "Classical",
	Nations: [],
	PhaseTypes: [],
	Season: [],
	UnitTypes: [],
	SvgVersion: "svg-version",
	ProvinceLongNames: {},
	NationColors: {},
	CreatedBy: "Player",
	Version: "first",
	Description: "Description",
	Rules: "Rules",
	OrderTypes: [],
	nationAbbreviations: {},
	Links: [],
};

export const variantResponse: VariantResponse = {
	Name: variant.Name,
	Properties: variant,
	Type: "List",
	Links: [],
};

export const listVariantsResponse: ListVariantsResponse = {
	Name: "Variants",
	Properties: [variantResponse],
	Type: "List",
	Links: [],
};

export const messaging: Messaging = {
	hasPermission: "false",
	hasToken: false,
	targetState: "undefined",
	token: null,
	tokenApp: "dipact-v1@",
	tokenEnabled: false,
	tokenOnServer: false,
};

export const initialState: RootState = {
	auth: {
		isLoggedIn: false,
	},
	colorOverrides: {
		nationCodes: {},
		variantCodes: {},
		positions: [],
		variants: {},
		nations: {},
	},
	diplicityService: {
		queries: {},
		mutations: {},
		provided: { [TagType.UserConfig]: {} },
		subscriptions: {},
		config: {
			refetchOnFocus: false,
			refetchOnMountOrArgChange: false,
			refetchOnReconnect: false,
			online: true,
			focused: true,
			middlewareRegistered: false,
			reducerPath: "diplicityService",
			keepUnusedDataFor: 60,
		},
	},
	feedback: { ids: [], entities: {} },
	latestForumMail: {},
	messaging,
	userBans: {},
	userStats: {},
};

export const newGame: NewGame = {
	Variant: "Classical",
	NationAllocation: 0,
	PhaseLengthMinutes: 1440,
	GameMasterEnabled: false,
	RequireGameMasterInvitation: false,
	NonMovementPhaseLengthMinutes: 0,
	Desc: "Game Name",
	Private: false,
	Anonymous: false,
	LastYear: 0,
	SkipMuster: true,
	MinReliability: 10,
	MinQuickness: 0,
	MinRating: 0,
	MaxRating: 0,
	MaxHated: 0,
	MaxHater: 0,
	DisableConferenceChat: false,
	DisableGroupChat: false,
	DisablePrivateChat: false,
	ChatLanguageISO639_1: "",
};

export const user: User = {
	Email: "fakeemail@gmail.com",
	FamilyName: "",
	Gender: "",
	GivenName: "",
	Hd: "",
	Id: "123456789",
	Link: "",
	Locale: "en",
	Name: "fakename",
	Picture: "",
	VerifiedEmail: true,
	ValidUntil: "2021-07-29T09:42:00.045036651Z",
};

export const userConfig: UserConfig = {
	Colors: [],
	FCMTokens: [],
	MailConfig: {},
	PhaseDeadlineWarningMinutesAhead: 0,
	UserId: "12345678",
};

export const userConfigResponse: UserConfigResponse = {
	Name: "user-config",
	Properties: userConfig,
	Type: "UserConfig",
	Links: [],
};

export const phaseState: PhaseState = {
	GameID: "",
	PhaseOrdinal: 0,
	Nation: "",
	ReadyToResolve: false,
	WantsDIAS: false,
	WantsConcede: false,
	OnProbation: false,
	NoOrders: false,
	Eliminated: false,
	Messages: "",
	ZippedOptions: null,
	Note: "",
};

export const member: Member = {
	User: user,
	Nation: "",
	GameAlias: "",
	NationPreferences: "",
	UnreadMessages: 0,
	Replacable: false,
	NewestPhaseState: phaseState,
};

export const game: Game = {
	...newGame,
	Closed: false,
	Finished: false,
	ID: "",
	Mustered: false,
	NoMerge: false,
	Started: false,
	GameMasterInvitations: null,
	GameMaster: user,
	NMembers: 0,
	Members: [member],
	StartETA: "",
	NewestPhaseMeta: null,
	ActiveBans: null,
	FailedRequirements: null,
	FirstMember: member,
	CreatedAt: "",
	CreatedAgo: "",
	StartedAt: "",
	StartedAgo: "",
	FinishedAt: "",
	FinishedAgo: "",
};

export const createGameResponse: CreateGameResponse = {
	Name: game.Desc,
	Properties: game,
	Type: "Game",
	Links: [],
};
