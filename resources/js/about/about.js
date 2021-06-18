import links from '../external_links/index.js';
import useStyles from './about.styles.js';

const About = () => {
	const classes  = useStyles();

	return (
		<div className={classes.root}>
			<MaterialUI.Container>
				<div className={classes.header}>
					<MaterialUI.Typography variant='h1'>
						About
					</MaterialUI.Typography>
				</div>
				<MaterialUI.Typography variant='h2' gutterBottom>
					Diplomacy
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					<a href={links.diplomacyWiki}>
						Diplomacy
					</a>{" "}
					is a game invented in the 50's by{" "}
					<a href={links.allanBCalhamerWiki}>
						Allan Calhamer
					</a>
					.
				</ MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					It bears a visual resemblance to{" "}
					<a href={links.riskWiki}>Risk</a>
					, in that it describes a territorial conflict using a map
					with player controlled regions and military units. However,
					unlike Risk, there's no element of chance. Discounting the
					initial distribution of territories and units, all outcomes
					are deterministic.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					The{" "}
					<a href={links.diplomacyRules}>
						rules
					</a>{" "}
					are designed to be simple, and make it almost impossible to
					make headway without combining forces with the other
					players, while at the same time enforcing a{" "}
					<a href={links.zeroSumGameWiki}>
						zero sum game
					</a>
					.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					This means that using diplomacy to convince the other
					players that the best way for them to win is to work with
					you, while at the same time making sure that you end up on
					top when the benefits of the alliance start to wane, is the
					most successful method of winning the game.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='h2' gutterBottom>Diplicity</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					<a href={links.diplicityGithub}>Diplicity</a> is
					technically an open source project providing a Diplomacy
					service using the judge powers of{" "}
					<a href={links.godipGithub}>godip</a>, another
					open source project.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					To provide maximum utility, a free server is hosted at{" "}
					<a href={links.hostedDiplicity}>
						{links.hostedDiplicity}
					</a>
					, where you can find a simple and free to use{" "}
					<a href={links.restWiki}>
						RESTful
					</a>{" "}
					<a href={links.jsonWiki}>JSON</a> API to
					interact with Diplomacy games.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					To enable humans to play the game, a few user interfaces to
					diplicity have been created, such as an{" "}
					<a href={links.androidApp}>
						Android app
					</a>{" "}
					(find the old version at{" "}
					<a href={links.oldVersions}>
						{links.oldVersions}
					</a>
					), with a web app version at{" "}
					<a href={links.webVersion}>{links.webVersion}</a>.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					You are currently using the web app (potentially wrapped in
					a native application) to view this information.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='h2' gutterBottom>This application</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					This application is a web app created to make it simple to
					play Diplomacy using the diplicity service.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='h3' gutterBottom>Account information</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					To minimize abuse and simplify usage, it uses your Google
					account information to identify you and will use your Google
					account name and avatar to refer to you when you interact
					with other players. To change your displayed name or avatar,
					change it in your Google account, and it will update (for
					new games you join) the next time you log in.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='h3' gutterBottom>Start playing</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					To play a game, you either create one yourself or join one
					already created. There are two categories of games, private
					and public. The public ones are listed in the Open games
					list, while the private ones require the creator to share a
					link for others to find them.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='h3' gutterBottom>Player statistics</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					To raise the quality of games and to let people play with
					others of similiar persuasion the system tracks a lot of
					stats for each player, and allows game creators to limit the
					players able to join the game to players having stats in
					defined intervals.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='h4' gutterBottom>Reliability</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					The most important of these is the Reliability statistic.
					Since a Diplomacy game where some players stop playing
					quickly becomes unbalanced, boring, and pointless, it is
					important to keep interacting with the game even when there
					isn't a chance of winning anymore, or when the other players
					have proven to be assholes, or when you just don't feel like
					it anymore. Just providing some random orders and submitting
					them is enough to make a huge positive difference.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					The reliability statistic is designed to reward active
					players by letting them join games with other active
					players. It works by calculating the number of active game
					phases divided by the number of inactive game phases, so
					that it represents the average number of phases between
					missing the deadline.
				</MaterialUI.Typography>
				<MaterialUI.Typography variant='body1'>
					When creating and joining games, it's recommended to (if
					possible when taking your own reliability into account)
					create and join games with a minimum reliability
					requirement of at least 10. This is helped by the minimum
					reliability of created games defaulting to your own
					reliability, or 10 if it's higher than 10.
				</MaterialUI.Typography>
			</MaterialUI.Container>
		</div>
	)

}
export default About;