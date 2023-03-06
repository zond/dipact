import {
  diplicityService as service,
  GameDetailView,
  GameDetailViewActions,
  TransformedGame,
  TransformedUser,
  TransformedVariant,
} from "../store";

type Query<T> = {
  data?: T | undefined;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isFetching: boolean;
};

type CombinedQuery<T> =
  | {
      data: undefined;
      isError: true;
      isFetching: boolean;
      isLoading: false;
      isSuccess: false;
    }
  | {
      data: T;
      isError: false;
      isFetching: boolean;
      isLoading: false;
      isSuccess: true;
    }
  | {
      data: undefined;
      isError: false;
      isFetching: boolean;
      isLoading: true;
      isSuccess: false;
    };

const isAnyLoading = (...queries: { isLoading: boolean }[]) => {
  return queries.some((query) => query.isLoading);
};

const isAnyError = (...queries: { isError: boolean }[]) => {
  return queries.some((query) => query.isError);
};
const isAnyFetching = (...queries: { isFetching: boolean }[]) => {
  return queries.some((query) => query.isFetching);
};

const isAllSuccess = (...queries: { isSuccess: boolean }[]) => {
  return queries.every((query) => query.isSuccess);
};

const isAllDataDefined = (...queries: { data?: any }[]) => {
  return queries.every((query) => query.data !== undefined);
};

const combineQueries = <A, B, C, T>(
  query1: Query<A>,
  query2: Query<B>,
  query3: Query<C>,
  transformer: (a: A | undefined, b: B | undefined, c: C | undefined) => T
): CombinedQuery<T> => {
  if (
    isAllSuccess(query1, query2, query3) &&
    isAllDataDefined(query1, query2, query3)
  ) {
    return {
      data: transformer(query1.data, query2.data, query3.data),
      isError: false,
      isFetching: isAnyFetching(query1, query2, query3),
      isLoading: false,
      isSuccess: true,
    };
  } else if (isAnyError(query1, query2, query3)) {
    return {
      data: undefined,
      isError: true,
      isFetching: isAnyFetching(query1, query2, query3),
      isLoading: false,
      isSuccess: false,
    };
  } else if (isAnyLoading(query1, query2, query3)) {
    return {
      data: undefined,
      isError: false,
      isFetching: isAnyFetching(query1, query2, query3),
      isLoading: true,
      isSuccess: false,
    };
  } else {
    return {
      data: undefined,
      isError: true,
      isFetching: false,
      isLoading: false,
      isSuccess: false,
    };
  }
};

const transformData = (
  game: TransformedGame,
  variants: TransformedVariant[],
  user: TransformedUser
): GameDetailView => {
  const getActions = (): GameDetailViewActions[] => {
    if (game.started === false) {
      if (game.members.find((member) => member.User.Id !== user.id)) {
        return ["join"];
      } else {
        return ["leave"];
      }
    }
    return [];
  };
  const variant = variants.find(
    (variant) => variant.name === game.variant
  ) as TransformedVariant;
  const actions = getActions();
  return {
    showActions: actions,
    name: game.name,
    gameSettings: {
      variant: {
        label: "Variant",
        value: game.variant,
        icon: "variant",
      },
      phaseDeadline: {
        label: "Phase deadline",
        value: game.phaseLength,
        icon: "phaseDeadline",
      },
      nonMovementPhaseDeadline: {
        label: "Non-movement phase deadline",
        value: game.nonMovementPhaseLength,
        icon: "nonMovementPhaseDeadline",
      },
      gameEndYear: {
        label: "Game ends after",
        value: game.endYear,
        icon: "gameEndYear",
      },
    },
    chatSettings: {
      conferenceChatEnabled: {
        label: "Conference chat",
        value: game.conferenceChatEnabled,
        icon: undefined,
      },
      privateChatEnabled: {
        label: "Private chat",
        value: game.privateChatEnabled,
        icon: undefined,
      },
      groupChatEnabled: {
        label: "Group chat",
        value: game.groupChatEnabled,
        icon: undefined,
      },
      chatLanguage: {
        label: "Chat language",
        value: game.chatLanguage,
        icon: "chatLanguage",
      },
    },
    managementSettings: {
      gameMaster: {
        label: "Game master",
        value: game.gameMaster,
        icon: "gameMaster",
      },
      nationAllocation: {
        label: "Nation allocation",
        value: game.nationAllocation,
        icon: "nationAllocation",
      },
      visibility: {
        label: "Visibility",
        value: game.visibility,
        icon: "visibility",
      },
    },
    playerSettings: {
      minCommittement: undefined, // TODO implement
      minRank: undefined, // TODO implement
      maxRank: undefined, // TODO implement
      playerIdentity: {
        label: "Player identity",
        value: game.playerIdentity,
        icon: "playerIdentity",
      },
    },
    gameLog: {
      created: {
        label: "Created",
        value: game.createdAt,
        icon: "date",
      },
      started: {
        label: "Started",
        value: game.startedAt,
        icon: "date",
      },
      finished: {
        label: "Finished",
        value: game.finishedAt,
        icon: "date",
      },
    },
    variantDetails: {
      name: {
        label: "Name",
        value: variant.name,
        icon: "variant",
      },
      description: {
        label: "Description",
        value: variant.description,
        icon: "description",
      },
      numPlayers: {
        label: "Num players",
        value: variant.nations.length,
        icon: "players",
      },
      rules: {
        label: "Rules",
        value: variant.rules,
        icon: "rules",
      },
      startYear: {
        label: "Start year",
        value: variant.startYear,
        icon: "date",
      },
    },
    playerDetails: {
      players: game.members.map((member) => ({
        id: member.User.Id,
        username: member.User.Name,
        src: member.User.Picture,
      })),
    },
  };
};

const useGameDetailView = (gameId: string) => {
  const getGameQuery = service.useGetGameV2Query(gameId);
  const listVariantsQuery = service.useListVariantsV2Query(undefined);
  const getRootQuery = service.useGetRootV2Query(undefined);
  const [joinGame, joinGameMutation] = service.useJoinGameMutation();

  const query = combineQueries(
    getGameQuery,
    listVariantsQuery,
    getRootQuery,
    transformData
  );

  const actions = {
    joinGame: {
      // TODO support join with preferences
      call: () => joinGame({ gameId, NationPreferences: "", GameAlias: "" }),
      mutation: joinGameMutation,
    },
    leaveGame: {
      call: () => joinGame({ gameId, NationPreferences: "", GameAlias: "" }),
      mutation: joinGameMutation,
    },
  };

  return {
    query,
    actions,
  };
};

export default useGameDetailView;
