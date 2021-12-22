// See: https://mswjs.io/docs/getting-started/mocks/rest-api
import { ResponseComposition, rest, RestContext, RestRequest } from "msw";
import {
  ListPhasesResponse,
  ListPhaseStatesResponse,
  PhaseState,
  PhaseStateResponse,
} from "../store/types";

import bansSuccess from "./responses/bansSuccess.json";
import createGameSuccess from "./responses/createGameSuccess.json";
import getGameSuccess from "./responses/getGameSuccess.json";
import getGameSuccessUserNotMember from "./responses/getGameSuccessUserNotMember.json";
import forumMailSuccess from "./responses/forumMailSuccess.json";
import histogramSuccess from "./responses/histogramSuccess.json";
import rootSuccess from "./responses/rootSuccess.json";
import updateUserConfigSuccess from "./responses/updateUserConfigSuccess.json";
import userConfigSuccessZond from "./responses/userConfigSuccessZond.json";
import userStatsSuccessNoGames from "./responses/userStatsSuccessNoGames.json";
import userStatsSuccessJoinedGames from "./responses/userStatsSuccessJoinedGames.json";
import userStatsSuccessZond from "./responses/userStatsSuccessZond.json";
import createMessageSuccess from "./responses/createMessageSuccess.json";
import messagesSuccess from "./responses/messagesSuccess.json";
import messagesSuccessNewMessage from "./responses/messagesSuccessNewMessage.json";
import messagesMultiplePhasesSuccess from "./responses/messagesMultiplePhasesSuccess.json";
import variantsSuccess from "./responses/variantsSuccess.json";
import variantsSuccessShort from "./responses/variantsSuccessShort.json";
import listPhasesSuccess from "./responses/listPhasesSuccess.json";
import listPhasesSuccessLarge from "./responses/listPhasesSuccessLarge.json";
import listPhaseStatesSuccess25 from "./responses/listPhaseStatesSuccess25.json";
import listPhaseStatesSuccess from "./responses/listPhaseStatesSuccess.json";
import listChannelsSuccess from "./responses/listChannelsSuccess.json";
import listChannelsSuccessNoChannels from "./responses/listChannelsSuccessNoChannels.json";

import listPhases from "./data/listPhases";
import listPhaseStates from "./data/listPhaseStates";

import {
  finishedGames,
  finishedGamesEmpty,
  masteredFinishedGames,
  masteredFinishedGamesEmpty,
  masteredStagingGames,
  masteredStagingGamesInvitation,
  masteredStagingGamesEmpty,
  masteredStartedGames,
  masteredStartedGamesEmpty,
  myFinishedGames,
  myFinishedGamesEmpty,
  myStagingGames,
  myStagingGamesEmpty,
  myStartedGames,
  myStartedGamesEmpty,
  stagingGames,
  stagingGamesEmpty,
  startedGames,
  startedGamesEmpty,
  startedGamesFailedRequirements,
  stagingGamesRandomNationAllocation,
} from "./responses/listGames";

const API_ROOT = "https://diplicity-engine.appspot.com/";

const internalServerError = (
  req: RestRequest<any, any>,
  res: ResponseComposition<any>,
  ctx: RestContext
) => {
  return res(ctx.status(500));
};

const tokenTimeout = (
  req: RestRequest<any, any>,
  res: ResponseComposition<any>,
  ctx: RestContext
) => {
  return res(ctx.status(401), ctx.json("token timed out"));
};

interface listPhasesRequestParams {
  gameId: string;
}

const getListPhasesHandlers = () => {
  const url = `${API_ROOT}Game/:gameId/Phases`;
  return {
    success: rest.get<{}, ListPhasesResponse, listPhasesRequestParams>(
      url,
      (req, res, ctx) => {
        const { gameId } = req.params;
        return res(ctx.status(200), ctx.json(listPhases[gameId]));
      }
    ),
    internalServerError: rest.get(url, internalServerError),
    tokenTimeout: rest.get(url, tokenTimeout),
  };
};

interface listPhaseStatesRequestParams {
  gameId: string;
  phaseId: string;
}

interface UpdatePhaseStateRequestParams {
  gameId: string;
  phaseId: string;
}

const listPhasesUrl = `${API_ROOT}Game/:gameId/Phases`;
export const createListPhasesHandler = (
  data: ListPhasesResponse,
  status: number = 200
) =>
  rest.get<{}, ListPhasesResponse, listPhasesRequestParams>(
    listPhasesUrl,
    (req, res, ctx) => res(ctx.status(status), ctx.json(data))
  );

const listPhaseStatesUrl = `${API_ROOT}Game/:gameId/Phase/:phaseId/PhaseStates`;
export const createListPhaseStateHandler = (
  data: ListPhaseStatesResponse,
  status: number = 200
) =>
  rest.get<{}, ListPhaseStatesResponse, listPhaseStatesRequestParams>(
    listPhaseStatesUrl,
    (req, res, ctx) => res(ctx.status(status), ctx.json(data))
  );

const getListPhaseStatesHandlers = () => {
  const url = listPhaseStatesUrl;
  return {
    success: rest.get<
      {},
      ListPhaseStatesResponse,
      listPhaseStatesRequestParams
    >(url, (req, res, ctx) => {
      const { gameId, phaseId } = req.params;
      return res(ctx.status(200), ctx.json(listPhaseStates[gameId][phaseId]));
    }),
    internalServerError: rest.get(url, internalServerError),
    tokenTimeout: rest.get(url, tokenTimeout),
  };
};

const updatePhaseStateUrl = `${API_ROOT}Game/:gameId/Phase/:phaseId/PhaseState`;
export const createUpdatePhaseStateHandler = (
  data: PhaseStateResponse,
  status: number = 200
) =>
  rest.put<{}, PhaseStateResponse, UpdatePhaseStateRequestParams>(
    updatePhaseStateUrl,
    (req, res, ctx) => res(ctx.status(status), ctx.json(data))
  );

const getUpdatePhaseStateHandlers = () => {
  const url = updatePhaseStateUrl;
  return {
    success: rest.put<
      PhaseState,
      PhaseStateResponse,
      UpdatePhaseStateRequestParams
    >(url, (req, res, ctx) => {
      const response = {
        Name: req.body.Nation,
        Type: "PhaseState",
        Links: [],
        Properties: req.body,
      };
      return res(ctx.status(200), ctx.json(response));
    }),
    internalServerError: rest.put(url, internalServerError),
    tokenTimeout: rest.put(url, tokenTimeout),
  };
};

const resolvers = {
  bans: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(bansSuccess));
    },
  },
  forumMail: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(forumMailSuccess));
    },
  },
  createGame: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(createGameSuccess));
    },
  },
  createMessage: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(createMessageSuccess));
    },
  },
  joinGame: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200));
    },
  },
  rescheduleGame: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200));
    },
  },
  renameGame: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200));
    },
  },
  unInvite: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200));
    },
  },
  invite: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200));
    },
  },
  getGame: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(getGameSuccess));
    },
    successUserNotMember: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(getGameSuccessUserNotMember));
    },
  },
  listChannels: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(listChannelsSuccess));
    },
    successNoChannels: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(listChannelsSuccessNoChannels));
    },
  },
  listGamesStarted: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(startedGames));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(startedGamesEmpty));
    },
    successFailedRequirements: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(startedGamesFailedRequirements));
    },
  },
  listGamesMyStarted: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myStartedGames));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myStartedGamesEmpty));
    },
  },
  listGamesMasteredStarted: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(masteredStartedGames));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(masteredStartedGamesEmpty));
    },
  },
  listGamesFinished: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(finishedGames));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(finishedGamesEmpty));
    },
  },
  listGamesMyFinished: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myFinishedGames));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myFinishedGamesEmpty));
    },
  },
  listGamesMasteredFinished: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(masteredFinishedGames));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(masteredFinishedGamesEmpty));
    },
  },
  listGamesStaging: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(stagingGames));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(stagingGamesEmpty));
    },
    successRandomAllocation: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(stagingGamesRandomNationAllocation));
    },
  },
  listGamesMyStaging: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myStagingGames));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myStagingGamesEmpty));
    },
  },
  listGamesMasteredStaging: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(masteredStagingGames));
    },
    successInvitation: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(masteredStagingGamesInvitation));
    },
    successEmpty: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(masteredStagingGamesEmpty));
    },
  },
  histogram: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(histogramSuccess));
    },
  },
  getUser: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(rootSuccess));
    },
  },
  updateUserConfig: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(updateUserConfigSuccess));
    },
  },
  userConfig: {
    successZond: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(userConfigSuccessZond));
    },
  },
  userStats: {
    successNoGames: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(userStatsSuccessNoGames));
    },
    successJoinedGames: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(userStatsSuccessJoinedGames));
    },
    successZond: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(userStatsSuccessZond));
    },
  },
  variants: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(variantsSuccess));
    },
    successShort: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(variantsSuccessShort));
    },
  },

  messages: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(messagesSuccess));
    },
    successMultiplePhases: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(messagesMultiplePhasesSuccess));
    },
    successNewMessage: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(messagesSuccessNewMessage));
    },
  },
};

const variantsUrl = `${API_ROOT}Variants`;
const getGameUrl = `${API_ROOT}Game/:gameId`;
const messagesUrl = `${API_ROOT}Game/:gameId/Channel/:channelId/Messages`;
const listChannelsUrl = `${API_ROOT}Game/:gameId/Channels`;
const createGameUrl = `${API_ROOT}Game`;
const createMessageUrl = `${API_ROOT}Game/:gameId/Messages`;
const joinGameUrl = `${API_ROOT}Game/:gameId/Member`;
const rescheduleGameUrl = `${API_ROOT}Game/:gameId/Phase/:PhaseOrdinal/DeadlineAt`;
const renameGameUrl = `${API_ROOT}Game/:gameId/Member/:userId`;
const unInviteUrl = `${API_ROOT}Game/:gameId/:email`;
const inviteUrl = `${API_ROOT}Game/:gameId`;
const getUserConfigUrl = `${API_ROOT}User/:userId/UserConfig`;
const updateUserConfigUrl = `${API_ROOT}User/:userId/UserConfig`;
const getUserUrl = `${API_ROOT}`;

const listGamesStartedUrl = `${API_ROOT}Games/started`;
const listGamesMyStartedUrl = `${API_ROOT}My/Games/started`;
const listGamesMasteredStartedUrl = `${API_ROOT}My/Mastered/Games/started`;
const listGamesFinishedUrl = `${API_ROOT}Games/finished`;
const listGamesMyFinishedUrl = `${API_ROOT}My/Games/finished`;
const listGamesMasteredFinishedUrl = `${API_ROOT}My/Mastered/Games/finished`;
const listGamesStagingUrl = `${API_ROOT}Games/staging`;
const listGamesMyStagingUrl = `${API_ROOT}My/Games/staging`;
const listGamesMasteredStagingUrl = `${API_ROOT}My/Mastered/Games/staging`;

export const handlers = {
  createGame: {
    success: rest.post(createGameUrl, resolvers.createGame.success),
    internalServerError: rest.post(createGameUrl, internalServerError),
    tokenTimeout: rest.post(createGameUrl, tokenTimeout),
  },
  createMessage: {
    success: rest.post(createMessageUrl, resolvers.createMessage.success),
    internalServerError: rest.post(createMessageUrl, internalServerError),
    tokenTimeout: rest.post(createMessageUrl, tokenTimeout),
  },
  joinGame: {
    success: rest.post(joinGameUrl, resolvers.joinGame.success),
    internalServerError: rest.post(joinGameUrl, internalServerError),
    tokenTimeout: rest.post(joinGameUrl, tokenTimeout),
  },
  rescheduleGame: {
    success: rest.post(rescheduleGameUrl, resolvers.rescheduleGame.success),
    internalServerError: rest.post(rescheduleGameUrl, internalServerError),
    tokenTimeout: rest.post(rescheduleGameUrl, tokenTimeout),
  },
  renameGame: {
    success: rest.put(renameGameUrl, resolvers.renameGame.success),
    internalServerError: rest.put(renameGameUrl, internalServerError),
    tokenTimeout: rest.put(renameGameUrl, tokenTimeout),
  },
  unInvite: {
    success: rest.delete(unInviteUrl, resolvers.unInvite.success),
    internalServerError: rest.delete(unInviteUrl, internalServerError),
    tokenTimeout: rest.delete(unInviteUrl, tokenTimeout),
  },
  invite: {
    success: rest.post(inviteUrl, resolvers.invite.success),
    internalServerError: rest.post(inviteUrl, internalServerError),
    tokenTimeout: rest.post(inviteUrl, tokenTimeout),
  },
  getGame: {
    success: rest.get(getGameUrl, resolvers.getGame.success),
    successUserNotMember: rest.get(
      getGameUrl,
      resolvers.getGame.successUserNotMember
    ),
    internalServerError: rest.get(getGameUrl, internalServerError),
    tokenTimeout: rest.get(messagesUrl, tokenTimeout),
  },
  getUser: {
    success: rest.get(getUserUrl, resolvers.getUser.success),
    internalServerError: rest.get(getUserUrl, internalServerError),
    tokenTimeout: rest.get(getUserUrl, tokenTimeout),
  },
  getUserConfig: {
    success: rest.get(getUserConfigUrl, resolvers.userConfig.successZond),
    internalServerError: rest.get(getUserConfigUrl, internalServerError),
    tokenTimeout: rest.get(getUserConfigUrl, tokenTimeout),
  },
  updateUserConfig: {
    success: rest.put(updateUserConfigUrl, resolvers.updateUserConfig.success),
    internalServerError: rest.put(updateUserConfigUrl, internalServerError),
  },
  variants: {
    success: rest.get(variantsUrl, resolvers.variants.success),
    successShort: rest.get(variantsUrl, resolvers.variants.successShort),
    internalServerError: rest.get(variantsUrl, internalServerError),
    tokenTimeout: rest.get(variantsUrl, tokenTimeout),
  },
  messages: {
    success: rest.get(messagesUrl, resolvers.messages.success),
    successMultiplePhases: rest.get(
      messagesUrl,
      resolvers.messages.successMultiplePhases
    ),
    successNewMessage: rest.get(
      messagesUrl,
      resolvers.messages.successNewMessage
    ),
    internalServerError: rest.get(messagesUrl, internalServerError),
    tokenTimeout: rest.get(messagesUrl, tokenTimeout),
  },
  listChannels: {
    success: rest.get(listChannelsUrl, resolvers.listChannels.success),
    successNoChannels: rest.get(
      listChannelsUrl,
      resolvers.listChannels.successNoChannels
    ),
    internalServerError: rest.get(listChannelsUrl, internalServerError),
    tokenTimeout: rest.get(listChannelsUrl, tokenTimeout),
  },
  listPhases: getListPhasesHandlers(),
  listPhaseStates: getListPhaseStatesHandlers(),
  updatePhaseState: getUpdatePhaseStateHandlers(),

  listGamesStarted: {
    success: rest.get(listGamesStartedUrl, resolvers.listGamesStarted.success),
    successEmpty: rest.get(
      listGamesStartedUrl,
      resolvers.listGamesStarted.successEmpty
    ),
    successFailedRequirements: rest.get(
      listGamesStartedUrl,
      resolvers.listGamesStarted.successFailedRequirements
    ),
    internalServerError: rest.get(listGamesStartedUrl, internalServerError),
    tokenTimeout: rest.get(listGamesStartedUrl, tokenTimeout),
  },
  listGamesMyStarted: {
    success: rest.get(
      listGamesMyStartedUrl,
      resolvers.listGamesMyStarted.success
    ),
    successEmpty: rest.get(
      listGamesMyStartedUrl,
      resolvers.listGamesMyStarted.successEmpty
    ),
    internalServerError: rest.get(listGamesMyStartedUrl, internalServerError),
    tokenTimeout: rest.get(listGamesMyStartedUrl, tokenTimeout),
  },
  listGamesMasteredStarted: {
    success: rest.get(
      listGamesMasteredStartedUrl,
      resolvers.listGamesMasteredStarted.success
    ),
    successEmpty: rest.get(
      listGamesMasteredStartedUrl,
      resolvers.listGamesMasteredStarted.successEmpty
    ),
    internalServerError: rest.get(
      listGamesMasteredStartedUrl,
      internalServerError
    ),
    tokenTimeout: rest.get(listGamesMasteredStartedUrl, tokenTimeout),
  },

  listGamesFinished: {
    success: rest.get(
      listGamesFinishedUrl,
      resolvers.listGamesFinished.success
    ),
    successEmpty: rest.get(
      listGamesFinishedUrl,
      resolvers.listGamesFinished.successEmpty
    ),
    internalServerError: rest.get(listGamesFinishedUrl, internalServerError),
    tokenTimeout: rest.get(listGamesFinishedUrl, tokenTimeout),
  },
  listGamesMyFinished: {
    success: rest.get(
      listGamesMyFinishedUrl,
      resolvers.listGamesMyFinished.success
    ),
    successEmpty: rest.get(
      listGamesMyFinishedUrl,
      resolvers.listGamesMyFinished.successEmpty
    ),
    internalServerError: rest.get(listGamesMyFinishedUrl, internalServerError),
    tokenTimeout: rest.get(listGamesMyFinishedUrl, tokenTimeout),
  },
  listGamesMasteredFinished: {
    success: rest.get(
      listGamesMasteredFinishedUrl,
      resolvers.listGamesMasteredFinished.success
    ),
    successEmpty: rest.get(
      listGamesMasteredFinishedUrl,
      resolvers.listGamesMasteredFinished.successEmpty
    ),
    internalServerError: rest.get(
      listGamesMasteredFinishedUrl,
      internalServerError
    ),
    tokenTimeout: rest.get(listGamesMasteredFinishedUrl, tokenTimeout),
  },

  listGamesStaging: {
    success: rest.get(listGamesStagingUrl, resolvers.listGamesStaging.success),
    successEmpty: rest.get(
      listGamesStagingUrl,
      resolvers.listGamesStaging.successEmpty
    ),
    successRandomAllocation: rest.get(
      listGamesStagingUrl,
      resolvers.listGamesStaging.successRandomAllocation
    ),
    internalServerError: rest.get(listGamesStagingUrl, internalServerError),
    tokenTimeout: rest.get(listGamesStagingUrl, tokenTimeout),
  },
  listGamesMyStaging: {
    success: rest.get(
      listGamesMyStagingUrl,
      resolvers.listGamesMyStaging.success
    ),
    successEmpty: rest.get(
      listGamesMyStagingUrl,
      resolvers.listGamesMyStaging.successEmpty
    ),
    internalServerError: rest.get(listGamesMyStagingUrl, internalServerError),
    tokenTimeout: rest.get(listGamesMyStagingUrl, tokenTimeout),
  },
  listGamesMasteredStaging: {
    success: rest.get(
      listGamesMasteredStagingUrl,
      resolvers.listGamesMasteredStaging.success
    ),
    successEmpty: rest.get(
      listGamesMasteredStagingUrl,
      resolvers.listGamesMasteredStaging.successEmpty
    ),
    successInvitation: rest.get(
      listGamesMasteredStagingUrl,
      resolvers.listGamesMasteredStaging.successInvitation
    ),
    internalServerError: rest.get(
      listGamesMasteredStagingUrl,
      internalServerError
    ),
    tokenTimeout: rest.get(listGamesMasteredStagingUrl, tokenTimeout),
  },
};

export const handlersList = [
  // bans
  rest.get(`${API_ROOT}User/:userId/Bans`, resolvers.bans.success),

  // forumMail
  rest.get(`${API_ROOT}ForumMail`, resolvers.forumMail.success),

  // histogram
  rest.get(`${API_ROOT}Users/Ratings/Histogram`, resolvers.histogram.success),

  // userStats
  // rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successNoGames),
  rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successZond),
  // rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successJoinedGames),

  handlers.getGame.success,
  handlers.getUser.success,
  handlers.getUserConfig.success,
  handlers.listChannels.success,
  handlers.listPhases.success,
  handlers.listPhaseStates.success,
  handlers.updatePhaseState.success,
  handlers.messages.successNewMessage,
  handlers.createMessage.success,
  handlers.updateUserConfig.success,
  handlers.variants.success,

  handlers.listGamesStarted.success,
  handlers.listGamesMyStarted.success,
  handlers.listGamesMasteredStarted.success,

  handlers.listGamesFinished.success,
  handlers.listGamesMyFinished.success,
  handlers.listGamesMasteredFinished.success,

  handlers.listGamesStaging.success,
  handlers.listGamesMyStaging.success,
  handlers.listGamesMasteredStaging.success,

  handlers.joinGame.internalServerError,
  handlers.rescheduleGame.success,
  handlers.renameGame.success,
  handlers.unInvite.success,
  handlers.invite.success,
];
