// Note, this used to be in Router but was causing problems during tests by loading the entire application
export const RouteConfig = {
	CreateGame: '/create-game',
	Donate: '/donate',
	Home: '/',
	Login: '/',
	GameTab: '/game/:gameId/:tab',
	Game: '/game/:gameId',
	GameChat: '/game/:gameId/chat',
	GameList: '/',
	GameChatChannel: '/game/:gameId/channel/:channelId/messages',
	GameLaboratoryMode: '/game/:gameId/lab/:labOptions',
	Orders: '/game/:gameId/orders',
	PlayerStats: '/player-stats',
	Settings: '/settings',
}