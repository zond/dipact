// See: https://mswjs.io/docs/getting-started/mocks/rest-api
import { rest } from "msw";
import bansSuccess from "./responses/bansSuccess.json";
import forumMailSuccess from "./responses/forumMailSuccess.json";
import histogramSuccess from "./responses/histogramSuccess.json";
import myFinishedGamesSuccess from "./responses/myFinishedGamesSuccess.json";
import myStagingGamesSuccessEmpty from "./responses/myStagingGamesSuccessEmpty.json";
import myStartedGamesSuccess from "./responses/myStartedGamesSuccess.json";
import userConfigSuccessZond from "./responses/userConfigSuccessZond.json";
import userStatsSuccessNoGames from "./responses/userStatsSuccessNoGames.json";
import userStatsSuccessJoinedGames from "./responses/userStatsSuccessJoinedGames.json";
import userStatsSuccessZond from "./responses/userStatsSuccessZond.json";
import variantsSuccess from "./responses/variantsSuccess.json";

const API_ROOT = "https://diplicity-engine.appspot.com/";

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
  userConfig: {
    successZond: (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(userConfigSuccessZond));
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
  },
};

export const handlers = [
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

  // userConfig
  rest.get(
    `${API_ROOT}User/:userId/UserConfig`,
    resolvers.userConfig.successZond
  ),

  // userStats
  // rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successNoGames),
  rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successZond),
  // rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successJoinedGames),

  // variants
  rest.get(`${API_ROOT}Variants`, resolvers.variants.success),
];
