// See: https://mswjs.io/docs/getting-started/mocks/rest-api
import { rest } from "msw";
import bansSuccess from "./responses/bansSuccess.json";
import createGameSuccess from "./responses/createGameSuccess.json";
import getGameSuccess from "./responses/getGameSuccess.json";
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
import messagesSuccess from "./responses/messagesSuccess.json";
import variantsSuccess from "./responses/variantsSuccess.json";
import variantsSuccessShort from "./responses/variantsSuccessShort.json";
import listChannelsSuccess from "./responses/listChannelsSuccess.json";
import listChannelsSuccessNoChannels from "./responses/listChannelsSuccessNoChannels.json";

const API_ROOT = "https://diplicity-engine.appspot.com/";

const internalServerError = (req, res, ctx) => {
  return res(ctx.status(500));
};
const tokenTimeout = (req, res, ctx) => {
  return res(ctx.status(401), ctx.text("token timed out"));
};

const resolvers = {
  bans: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(bansSuccess));
    },
  },
  forumMail: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(forumMailSuccess));
    },
  },
  createGame: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(createGameSuccess));
    },
  },
  getGame: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(getGameSuccess));
    },
  },
  listChannels: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(listChannelsSuccess));
    },
    successNoChannels: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(listChannelsSuccessNoChannels));
    },
  },
  histogram: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(histogramSuccess));
    },
  },
  myFinishedGames: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(myFinishedGamesSuccess));
    },
  },
  myStagingGames: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(myStagingGamesSuccessEmpty));
    },
  },
  myStartedGames: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(myStartedGamesSuccess));
    },
  },
  getUser: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(rootSuccess));
    },
  },
  updateUserConfig: {
    success: (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(updateUserConfigSuccess)
      );
    },
  },
  userConfig: {
    successZond: (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(userConfigSuccessZond)
      );
    },
  },
  userStats: {
    successNoGames: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(userStatsSuccessNoGames));
    },
    successJoinedGames: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(userStatsSuccessJoinedGames));
    },
    successZond: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(userStatsSuccessZond));
    },
  },
  variants: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(variantsSuccess));
    },
    successShort: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(variantsSuccessShort));
    },
  },

  messages: {
    success: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(messagesSuccess));
    },
  },
};

const variantsUrl = `${API_ROOT}Variants`;
const getGameUrl = `${API_ROOT}Game/:gameId`;
const messagesUrl = `${API_ROOT}Game/:gameId/Channel/:channelId/Messages`;
const listChannelsUrl = `${API_ROOT}Game/:gameId/Channels`;
const createGameUrl = `${API_ROOT}Game`;
const getUserConfigUrl = `${API_ROOT}User/:userId/UserConfig`;
const updateUserConfigUrl = `${API_ROOT}User/:userId/UserConfig`;
const getUserUrl = `${API_ROOT}User`;

export const handlers = {
  createGame: {
    success: rest.post(createGameUrl, resolvers.createGame.success),
    internalServerError: rest.post(createGameUrl, internalServerError),
    tokenTimeout: rest.post(createGameUrl, tokenTimeout),
  },
  getGame: {
    success: rest.get(getGameUrl, resolvers.getGame.success),
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
    internalServerError: rest.get(messagesUrl, internalServerError),
    tokenTimeout: rest.get(messagesUrl, tokenTimeout),
  },
  listChannels: {
    success: rest.get(listChannelsUrl, resolvers.listChannels.success),
    successNoChannels: rest.get(listChannelsUrl, resolvers.listChannels.successNoChannels),
    internalServerError: rest.get(listChannelsUrl, internalServerError),
    tokenTimeout: rest.get(listChannelsUrl, tokenTimeout),
  },
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

  handlers.variants.success,
  handlers.updateUserConfig.success,
  handlers.getGame.success,
  handlers.getUser.success,
  handlers.getUserConfig.success,
  handlers.listChannels.success,
];
