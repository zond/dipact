import { GameStatus } from "../../hooks/useGameList";

interface Options {
  failedRequirements?: string[];
}

const getGame = (status: GameStatus, my: boolean, mastered: boolean, empty?: boolean, options?: Options) => {
  const failedRequirements = options?.failedRequirements || null;
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
            ID: "ahJzfmRpcGxpY2l0eS1lbmdpbmVyEQsSBEdhbWUYgIDAwJLy2QsM",
            Started: false,
            Mustered: true,
            Closed: false,
            Finished: false,
            Desc: name,
            Variant: "Western World 901",
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
            NationAllocation: 1,
            Anonymous: false,
            LastYear: 0,
            SkipMuster: true,
            ChatLanguageISO639_1: "en",
            GameMasterEnabled: false,
            RequireGameMasterInvitation: false,
            GameMasterInvitations: null,
            GameMaster: {
              Email: "",
              FamilyName: "",
              Gender: "",
              GivenName: "",
              Hd: "",
              Id: "",
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
                  Id: "101894254060153183481",
                  Link: "",
                  Locale: "ca",
                  Name: "MonKers MasNet",
                  Picture:
                    "https://lh3.googleusercontent.com/a/AATXAJw3XSxn558pM9Y9KZxDX8nA9m-YXQzUSdkzbiwH=s96-c",
                  VerifiedEmail: true,
                  ValidUntil: "2021-11-03T19:24:34.852274Z",
                },
                Nation: "East Frankish Kingdom",
                GameAlias: "",
                NationPreferences:
                  "West Frankish Kingdom,East Frankish Kingdom,Kingdom of Denmark,Abbasid Caliphate,Umayyad Emirate,Tulunid Emirate,Principality of Kiev,Khaganate of Khazaria,Eastern Roman Empire",
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
                UnitsJSON:
                  '[{"Province":"bav","Unit":{"Type":"Army","Nation":"East Frankish Kingdom"}},{"Province":"sax","Unit":{"Type":"Army","Nation":"East Frankish Kingdom"}},{"Province":"bag","Unit":{"Type":"Army","Nation":"Abbasid Caliphate"}},{"Province":"ros","Unit":{"Type":"Army","Nation":"Principality of Kiev"}},{"Province":"bre","Unit":{"Type":"Fleet","Nation":"East Frankish Kingdom"}},{"Province":"pam","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"nar","Unit":{"Type":"Army","Nation":"West Frankish Kingdom"}},{"Province":"cad","Unit":{"Type":"Fleet","Nation":"Umayyad Emirate"}},{"Province":"ifr","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"aze","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"btt","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"con","Unit":{"Type":"Army","Nation":"Eastern Roman Empire"}},{"Province":"est","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"lot","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"dal","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"thr","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"tam","Unit":{"Type":"Army","Nation":"Khaganate of Khazaria"}},{"Province":"cod","Unit":{"Type":"Army","Nation":"Umayyad Emirate"}},{"Province":"snc","Unit":{"Type":"Army","Nation":"Umayyad Emirate"}},{"Province":"swa","Unit":{"Type":"Army","Nation":"East Frankish Kingdom"}},{"Province":"pec","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"mav","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"jer","Unit":{"Type":"Fleet","Nation":"Tulunid Emirate"}},{"Province":"sak","Unit":{"Type":"Army","Nation":"Khaganate of Khazaria"}},{"Province":"tar","Unit":{"Type":"Fleet","Nation":"Eastern Roman Empire"}},{"Province":"ira","Unit":{"Type":"Army","Nation":"Abbasid Caliphate"}},{"Province":"att","Unit":{"Type":"Fleet","Nation":"Eastern Roman Empire"}},{"Province":"geo","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"rom","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"urg","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"smo","Unit":{"Type":"Army","Nation":"Principality of Kiev"}},{"Province":"ati","Unit":{"Type":"Army","Nation":"Khaganate of Khazaria"}},{"Province":"bar","Unit":{"Type":"Fleet","Nation":"Tulunid Emirate"}},{"Province":"bor","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"bja","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"isf","Unit":{"Type":"Army","Nation":"Abbasid Caliphate"}},{"Province":"cos","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"ard","Unit":{"Type":"Army","Nation":"Abbasid Caliphate"}},{"Province":"sad","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"dub","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"cyp","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"val","Unit":{"Type":"Fleet","Nation":"Umayyad Emirate"}},{"Province":"crn","Unit":{"Type":"Fleet","Nation":"Eastern Roman Empire"}},{"Province":"ale","Unit":{"Type":"Army","Nation":"Tulunid Emirate"}},{"Province":"sca","Unit":{"Type":"Fleet","Nation":"Kingdom of Denmark"}},{"Province":"bnj","Unit":{"Type":"Army","Nation":"Khaganate of Khazaria"}},{"Province":"aqt","Unit":{"Type":"Army","Nation":"West Frankish Kingdom"}},{"Province":"arm","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"bul","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"cre","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"par","Unit":{"Type":"Fleet","Nation":"West Frankish Kingdom"}},{"Province":"gas","Unit":{"Type":"Army","Nation":"West Frankish Kingdom"}},{"Province":"maz","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"vik","Unit":{"Type":"Army","Nation":"Kingdom of Denmark"}},{"Province":"jor/ec","Unit":{"Type":"Fleet","Nation":"Kingdom of Denmark"}},{"Province":"dam","Unit":{"Type":"Army","Nation":"Tulunid Emirate"}},{"Province":"bas","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"low","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"mau","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"nov","Unit":{"Type":"Fleet","Nation":"Principality of Kiev"}},{"Province":"kie","Unit":{"Type":"Army","Nation":"Principality of Kiev"}},{"Province":"jel","Unit":{"Type":"Fleet","Nation":"Kingdom of Denmark"}},{"Province":"sic","Unit":{"Type":"Army","Nation":"Neutral"}},{"Province":"wsx","Unit":{"Type":"Army","Nation":"Neutral"}}]',
                SCsJSON:
                  '[{"Province":"isf","Owner":"Abbasid Caliphate"},{"Province":"bul","Owner":"Neutral"},{"Province":"nar","Owner":"West Frankish Kingdom"},{"Province":"geo","Owner":"Neutral"},{"Province":"jer","Owner":"Tulunid Emirate"},{"Province":"att","Owner":"Eastern Roman Empire"},{"Province":"wsx","Owner":"Neutral"},{"Province":"bnj","Owner":"Khaganate of Khazaria"},{"Province":"bar","Owner":"Tulunid Emirate"},{"Province":"sax","Owner":"East Frankish Kingdom"},{"Province":"aze","Owner":"Neutral"},{"Province":"thr","Owner":"Neutral"},{"Province":"cod","Owner":"Umayyad Emirate"},{"Province":"ira","Owner":"Abbasid Caliphate"},{"Province":"dam","Owner":"Tulunid Emirate"},{"Province":"dub","Owner":"Neutral"},{"Province":"dal","Owner":"Neutral"},{"Province":"mav","Owner":"Neutral"},{"Province":"ifr","Owner":"Neutral"},{"Province":"kie","Owner":"Principality of Kiev"},{"Province":"aqt","Owner":"West Frankish Kingdom"},{"Province":"pam","Owner":"Neutral"},{"Province":"bre","Owner":"East Frankish Kingdom"},{"Province":"swa","Owner":"East Frankish Kingdom"},{"Province":"par","Owner":"West Frankish Kingdom"},{"Province":"gas","Owner":"West Frankish Kingdom"},{"Province":"bas","Owner":"Neutral"},{"Province":"low","Owner":"Neutral"},{"Province":"pec","Owner":"Neutral"},{"Province":"sic","Owner":"Neutral"},{"Province":"val","Owner":"Umayyad Emirate"},{"Province":"snc","Owner":"Umayyad Emirate"},{"Province":"mau","Owner":"Neutral"},{"Province":"bav","Owner":"East Frankish Kingdom"},{"Province":"ard","Owner":"Abbasid Caliphate"},{"Province":"sad","Owner":"Neutral"},{"Province":"smo","Owner":"Principality of Kiev"},{"Province":"jor","Owner":"Kingdom of Denmark"},{"Province":"est","Owner":"Neutral"},{"Province":"urg","Owner":"Neutral"},{"Province":"cre","Owner":"Neutral"},{"Province":"cad","Owner":"Umayyad Emirate"},{"Province":"tar","Owner":"Eastern Roman Empire"},{"Province":"sak","Owner":"Khaganate of Khazaria"},{"Province":"cyp","Owner":"Neutral"},{"Province":"btt","Owner":"Neutral"},{"Province":"maz","Owner":"Neutral"},{"Province":"sca","Owner":"Kingdom of Denmark"},{"Province":"ati","Owner":"Khaganate of Khazaria"},{"Province":"con","Owner":"Eastern Roman Empire"},{"Province":"arm","Owner":"Neutral"},{"Province":"nov","Owner":"Principality of Kiev"},{"Province":"jel","Owner":"Kingdom of Denmark"},{"Province":"bja","Owner":"Neutral"},{"Province":"ale","Owner":"Tulunid Emirate"},{"Province":"bor","Owner":"Neutral"},{"Province":"crn","Owner":"Eastern Roman Empire"},{"Province":"rom","Owner":"Neutral"},{"Province":"lot","Owner":"Neutral"},{"Province":"cos","Owner":"Neutral"},{"Province":"ros","Owner":"Principality of Kiev"},{"Province":"vik","Owner":"Kingdom of Denmark"},{"Province":"tam","Owner":"Khaganate of Khazaria"},{"Province":"bag","Owner":"Abbasid Caliphate"}]',
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

export const startedGames = getGame(GameStatus.Started, false, false);
export const myStartedGames = getGame(GameStatus.Started, true, false);
export const masteredStartedGames = getGame(GameStatus.Started, true, true);

export const finishedGames = getGame(GameStatus.Finished, false, false);
export const myFinishedGames = getGame(GameStatus.Finished, true, false);
export const masteredFinishedGames = getGame(GameStatus.Finished, true, true);

export const stagingGames = getGame(GameStatus.Staging, false, false);
export const myStagingGames = getGame(GameStatus.Staging, true, false);
export const masteredStagingGames = getGame(GameStatus.Staging, true, true);

export const startedGamesEmpty = getGame(GameStatus.Started, false, false, true);
export const myStartedGamesEmpty = getGame(GameStatus.Started, true, false, true);
export const masteredStartedGamesEmpty = getGame(GameStatus.Started, true, true, true);

export const finishedGamesEmpty = getGame(GameStatus.Finished, false, false, true);
export const myFinishedGamesEmpty = getGame(GameStatus.Finished, true, false, true);
export const masteredFinishedGamesEmpty = getGame(GameStatus.Finished, true, true, true);

export const stagingGamesEmpty = getGame(GameStatus.Staging, false, false, true);
export const myStagingGamesEmpty = getGame(GameStatus.Staging, true, false, true);
export const masteredStagingGamesEmpty = getGame(GameStatus.Staging, true, true, true);

export const startedGamesFailedRequirements = getGame(GameStatus.Started, false, false, false, { failedRequirements: ["Hated", "MinRating"]});