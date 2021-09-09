// Note, this used to be in Router but was causing problems during tests by loading the entire application
export const RouteConfig = {
	About: '/about',
	GameTab: '/game/:gameId/:tab',
	Game: '/game/:gameId',
	GameChat: '/game/:gameId/chat',
	GameChatChannel: '/game/:gameId/channel/:channelId/messages',
	GameLaboratoryMode: '/game/:gameId/lab/:labOptions',
}