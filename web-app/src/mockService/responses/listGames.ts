import { GameStatus } from "@diplicity/common";
import { GameMasterInvitation } from "@diplicity/common";

interface Options {
  failedRequirements?: string[];
  nationAllocation?: number;
  gameMasterId?: string;
  invitations?: GameMasterInvitation[];
  userId?: string;
}

const getGame = (
  status: GameStatus,
  my: boolean,
  mastered: boolean,
  empty?: boolean,
  options?: Options
) => {
  const failedRequirements = options?.failedRequirements || null;
  const nationAllocation =
    typeof options?.nationAllocation === "undefined"
      ? 1
      : options?.nationAllocation;
  const requestName = mastered
    ? `mastered-${status}-games`
    : my
    ? `my-${status}-games`
    : `${status}-games`;

  const name = mastered
    ? `Name of my mastered ${status} game`
    : my
    ? `Name of my ${status} game`
    : `Name of ${status} game`;

  const games = empty
    ? []
    : [
        {
          Name: name,
          Properties: {
            ID: "game-123",
            Started: false,
            Mustered: true,
            Closed: false,
            Finished: false,
            Desc: name,
            Variant: "Classical",
            PhaseLengthMinutes: 1440,
            NonMovementPhaseLengthMinutes: 0,
            MaxHated: 0,
            MaxHater: 0,
            MinRating: 0,
            MaxRating: 0,
            MinReliability: 10,
            MinQuickness: 0,
            Private: false,
            NoMerge: false,
            DisableConferenceChat: false,
            DisableGroupChat: false,
            DisablePrivateChat: false,
            NationAllocation: nationAllocation,
            Anonymous: false,
            LastYear: 0,
            SkipMuster: true,
            ChatLanguageISO639_1: "en",
            GameMasterEnabled: false,
            RequireGameMasterInvitation: false,
            GameMasterInvitations: options?.invitations || null,
            GameMaster: {
              Email: "",
              FamilyName: "",
              Gender: "",
              GivenName: "",
              Hd: "",
              Id: options?.gameMasterId || "",
              Link: "",
              Locale: "",
              Name: "",
              Picture: "",
              VerifiedEmail: false,
              ValidUntil: "0001-01-01T00:00:00Z",
            },
            NMembers: 9,
            Members: [
              {
                User: {
                  Email: "",
                  FamilyName: "MasNet",
                  Gender: "",
                  GivenName: "MonKers",
                  Hd: "",
                  Id: options?.userId || "",
                  Link: "",
                  Locale: "ca",
                  Name: "MonKers MasNet",
                  Picture:
                    "https://lh3.googleusercontent.com/a/AATXAJw3XSxn558pM9Y9KZxDX8nA9m-YXQzUSdkzbiwH=s96-c",
                  VerifiedEmail: true,
                  ValidUntil: "2021-11-03T19:24:34.852274Z",
                },
                Nation: "France",
                GameAlias: "",
                NationPreferences: "",
                NewestPhaseState: {
                  GameID: null,
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
                },
                UnreadMessages: 0,
                Replaceable: false,
              },
            ],
            StartETA: "2021-12-10T12:02:33.960644Z",
            NewestPhaseMeta: [
              {
                PhaseOrdinal: 1,
                Season: "Spring",
                Year: 901,
                Type: "Movement",
                Resolved: false,
                CreatedAt: "2021-12-10T12:02:33.960754Z",
                CreatedAgo: -2992474103006,
                ResolvedAt: "0001-01-01T00:00:00Z",
                ResolvedAgo: 0,
                DeadlineAt: "2021-12-11T12:02:33.960754Z",
                NextDeadlineIn: 83407525897740,
                UnitsJSON: "",
                SCsJSON: "",
              },
            ],
            ActiveBans: null,
            FailedRequirements: failedRequirements,
            CreatedAt: "2021-10-30T22:57:59.834345Z",
            CreatedAgo: -3506066600512425,
            StartedAt: "2021-12-10T12:02:33.960644Z",
            StartedAgo: -2992474213592,
            FinishedAt: "0001-01-01T00:00:00Z",
            FinishedAgo: 0,
          },
          Type: "Game",
          Links: [
            {
              Rel: "self",
              URL:
                "https://diplicity-engine.appspot.com/Game/ahJzfmRpcGxpY2l0eS1lbmdpbmVyEQsSBEdhbWUYgIDAwJLy2QsM",
              Method: "GET",
            },
            {
              Rel: "channels",
              URL:
                "https://diplicity-engine.appspot.com/Game/ahJzfmRpcGxpY2l0eS1lbmdpbmVyEQsSBEdhbWUYgIDAwJLy2QsM/Channels",
              Method: "GET",
            },
            {
              Rel: "phases",
              URL:
                "https://diplicity-engine.appspot.com/Game/ahJzfmRpcGxpY2l0eS1lbmdpbmVyEQsSBEdhbWUYgIDAwJLy2QsM/Phases",
              Method: "GET",
            },
            {
              Rel: "game-states",
              URL:
                "https://diplicity-engine.appspot.com/Game/ahJzfmRpcGxpY2l0eS1lbmdpbmVyEQsSBEdhbWUYgIDAwJLy2QsM/GameStates",
              Method: "GET",
            },
          ],
        },
      ];
  return {
    Name: requestName,
    Properties: games,
    Desc: [],
    Type: "List",
    Links: [
      {
        Rel: "self",
        URL: `https://diplicity-engine.appspot.com/Games/${status}`,
        Method: "GET",
      },
    ],
  };
};

const userId = "123456789";

export const startedGames = getGame(GameStatus.Started, false, false);
export const myStartedGames = getGame(GameStatus.Started, true, false, false, { userId });
export const masteredStartedGames = getGame(
  GameStatus.Started,
  true,
  true,
  undefined,
  { gameMasterId: userId, userId }
);

export const finishedGames = getGame(GameStatus.Finished, false, false);
export const myFinishedGames = getGame(GameStatus.Finished, true, false, false, { userId });
export const masteredFinishedGames = getGame(GameStatus.Finished, true, true, false, { userId });

export const stagingGames = getGame(GameStatus.Staging, false, false);
export const myStagingGames = getGame(GameStatus.Staging, true, false, false, { userId });
export const masteredStagingGames = getGame(
  GameStatus.Staging,
  true,
  true,
  undefined,
  { gameMasterId: "123456789", userId }
);
export const masteredStagingGamesInvitation = getGame(
  GameStatus.Staging,
  true,
  true,
  undefined,
  {
    gameMasterId: userId,
    invitations: [{ Email: "fakeemail@fakememail.com", Nation: "England" }],
  }
);


export const startedGamesEmpty = getGame(
  GameStatus.Started,
  false,
  false,
  true
);
export const myStartedGamesEmpty = getGame(
  GameStatus.Started,
  true,
  false,
  true,
  { userId }
);
export const masteredStartedGamesEmpty = getGame(
  GameStatus.Started,
  true,
  true,
  true,
  { userId }
);

export const finishedGamesEmpty = getGame(
  GameStatus.Finished,
  false,
  false,
  true
);
export const myFinishedGamesEmpty = getGame(
  GameStatus.Finished,
  true,
  false,
  true,
  { userId }
);
export const masteredFinishedGamesEmpty = getGame(
  GameStatus.Finished,
  true,
  true,
  true,
  { userId }
);

export const stagingGamesEmpty = getGame(
  GameStatus.Staging,
  false,
  false,
  true
);
export const myStagingGamesEmpty = getGame(
  GameStatus.Staging,
  true,
  false,
  true,
  { userId }
);
export const masteredStagingGamesEmpty = getGame(
  GameStatus.Staging,
  true,
  true,
  true,
  { userId }
);

export const startedGamesFailedRequirements = getGame(
  GameStatus.Started,
  false,
  false,
  false,
  { failedRequirements: ["Hated", "MinRating"] }
);

export const stagingGamesRandomNationAllocation = getGame(
  GameStatus.Staging,
  false,
  false,
  false,
  { nationAllocation: 0 }
);
