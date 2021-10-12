// See: https://mswjs.io/docs/getting-started/mocks/rest-api
import { ResponseComposition, rest, RestContext, RestRequest } from "msw";
import { ListPhasesResponse, ListPhaseStatesResponse, PhaseState, PhaseStateResponse } from "../store/types";

import bansSuccess from "./responses/bansSuccess.json";
import createGameSuccess from "./responses/createGameSuccess.json";
import getGameSuccess from "./responses/getGameSuccess.json";
import getGameSuccessUserNotMember from "./responses/getGameSuccessUserNotMember.json";
import forumMailSuccess from "./responses/forumMailSuccess.json";
import histogramSuccess from "./responses/histogramSuccess.json";
import myFinishedGamesSuccess from "./responses/myFinishedGamesSuccess.json";
import myStagingGamesSuccessEmpty from "./responses/myStagingGamesSuccessEmpty.json";
import myStartedGamesSuccess from "./responses/myStartedGamesSuccess.json";
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
      }
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
  histogram: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(histogramSuccess));
    },
  },
  myFinishedGames: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myFinishedGamesSuccess));
    },
  },
  myStagingGames: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myStagingGamesSuccessEmpty));
    },
  },
  myStartedGames: {
    success: (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json(myStartedGamesSuccess));
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
const getUserConfigUrl = `${API_ROOT}User/:userId/UserConfig`;
const updateUserConfigUrl = `${API_ROOT}User/:userId/UserConfig`;
const getUserUrl = `${API_ROOT}User`;

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
};

export const handlersList = [
  // bans
  rest.get(`${API_ROOT}User/:userId/Bans`, resolvers.bans.success),

  // forumMail
  rest.get(`${API_ROOT}ForumMail`, resolvers.forumMail.success),

  // histogram
  rest.get(`${API_ROOT}Users/Ratings/Histogram`, resolvers.histogram.success),

  // myFinishedGames
  rest.get(`${API_ROOT}Games/My/Finished`, resolvers.myFinishedGames.success),

  // myStagingGames
  rest.get(`${API_ROOT}Games/My/Staging`, resolvers.myStagingGames.success),

  // myStartedGames
  rest.get(`${API_ROOT}Games/My/Started`, resolvers.myStartedGames.success),

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
];
