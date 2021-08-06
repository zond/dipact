// See: https://mswjs.io/docs/getting-started/mocks/rest-api
import { rest } from "msw";
import bansSuccess from "./responses/bansSuccess.json";
import createGameSuccess from "./responses/createGameSuccess.json";
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
import variantsSuccess from "./responses/variantsSuccess.json";

const API_ROOT = "https://diplicity-engine.appspot.com/";

const internalServerError = (req, res, ctx) => {
	return res(ctx.status(500));
};
const tokenTimeout = (req, res, ctx) => {
	return res(ctx.status(401), ctx.text("token timed out"));
};

const mockServiceLatency = 5000; // TODO move to env

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
	getRoot: {
		success: (req, res, ctx) => {
			return res(ctx.status(200), ctx.json(rootSuccess));
		},
	},
	updateUserConfig: {
		success: (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.delay(mockServiceLatency), // TODO add to all handlers
				ctx.json(updateUserConfigSuccess)
			);
		},
	},
	userConfig: {
		successZond: (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.delay(mockServiceLatency), // TODO add to all handlers
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
	},
};

const variantsUrl = `${API_ROOT}Variants`;
const createGameUrl = `${API_ROOT}Game`;
const updateUserConfigUrl = `${API_ROOT}User/:userId/UserConfig`;
const getRootUrl = `${API_ROOT}`;

export const handlers = {
	createGame: {
		success: rest.post(createGameUrl, resolvers.createGame.success),
		internalServerError: rest.post(createGameUrl, internalServerError),
		tokenTimeout: rest.post(createGameUrl, tokenTimeout),
	},
	getRoot: {
		success: rest.get(getRootUrl, resolvers.getRoot.success),
		internalServerError: rest.get(getRootUrl, internalServerError),
		tokenTimeout: rest.get(getRootUrl, tokenTimeout),
	},
	updateUserConfig: {
		success: rest.put(updateUserConfigUrl, resolvers.updateUserConfig.success),
		internalServerError: rest.put(updateUserConfigUrl, internalServerError),
	},
	variants: {
		success: rest.get(variantsUrl, resolvers.variants.success),
		internalServerError: rest.get(variantsUrl, internalServerError),
		tokenTimeout: rest.get(variantsUrl, tokenTimeout),
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

	// userConfig
	rest.get(
		`${API_ROOT}User/:userId/UserConfig`,
		resolvers.userConfig.successZond
	),

	// userStats
	// rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successNoGames),
	rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successZond),
	// rest.get(`${API_ROOT}User/:userId/Stats`, resolvers.userStats.successJoinedGames),

	handlers.variants.success,
	handlers.updateUserConfig.success,
	handlers.getRoot.success,
];
