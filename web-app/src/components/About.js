import React from 'react';

export default class About extends React.Component {

	render() {
		return (
			<div
				id="scroller"
				style={{
					overflowY: "scroll",
					height: "calc(100% - 60px)",
					padding: "12px",
				}}
			>
				<h2>Diplomacy</h2>
				<p>
					<a href="https://en.wikipedia.org/wiki/Diplomacy_(game)">
						Diplomacy
					</a>{" "}
					is a game invented in the 50's by{" "}
					<a href="https://en.wikipedia.org/wiki/Allan_B._Calhamer">
						Allan Calhamer
					</a>
					.
				</p>
				<p>
					It bears a visual resemblance to{" "}
					<a href="https://en.wikipedia.org/wiki/Risk_(game)">Risk</a>
					, in that it describes a territorial conflict using a map
					with player controlled regions and military units. However,
					unlike Risk, there's no element of chance. Discounting the
					initial distribution of territories and units, all outcomes
					are deterministic.
				</p>
				<p>
					The{" "}
					<a href="https://en.wikibooks.org/wiki/Diplomacy/Rules">
						rules
					</a>{" "}
					are designed to be simple, and make it almost impossible to
					make headway without combining forces with the other
					players, while at the same time enforcing a{" "}
					<a href="https://en.wikipedia.org/wiki/Zero-sum_game">
						zero sum game
					</a>
					.
				</p>
				<p>
					This means that using diplomacy to convince the other
					players that the best way for them to win is to work with
					you, while at the same time making sure that you end up on
					top when the benefits of the alliance start to wane, is the
					most successful method of winning the game.
				</p>
				<h2>Diplicity</h2>
				<p>
					<a href="https://github.com/zond/diplicity">Diplicity</a> is
					technically an open source project providing a Diplomacy
					service using the judge powers of{" "}
					<a href="https://github.com/zond/godip">godip</a>, another
					open source project.
				</p>
				<p>
					To provide maximum utility, a free server is hosted at{" "}
					<a href="https://diplicity-engine.appspot.com/">
						https://diplicity-engine.appspot.com
					</a>
					, where you can find a simple and free to use{" "}
					<a href="https://en.wikipedia.org/wiki/Representational_state_transfer">
						RESTful
					</a>{" "}
					<a href="https://en.wikipedia.org/wiki/JSON">JSON</a> API to
					interact with Diplomacy games.
				</p>
				<p>
					To enable humans to play the game, a few user interfaces to
					diplicity have been created, such as an{" "}
					<a href="https://play.google.com/store/apps/details?id=se.oort.diplicity">
						Android app
					</a>{" "}
					(find the old version at{" "}
					<a href="https://github.com/zond/android-diplicity/releases">
						https://github.com/zond/android-diplicity/releases
					</a>
					), with a web app version at{" "}
					<a href="https://diplicity.com">https://diplicity.com</a>.
				</p>
				<p>
					You are currently using the web app (potentially wrapped in
					a native application) to view this information.
				</p>
				<h2>This application</h2>
				<p>
					This application is a web app created to make it simple to
					play Diplomacy using the diplicity service.
				</p>
				<h3>Account information</h3>
				<p>
					To minimize abuse and simplify usage, it uses your Google
					account information to identify you and will use your Google
					account name and avatar to refer to you when you interact
					with other players. To change your displayed name or avatar,
					change it in your Google account, and it will update (for
					new games you join) the next time you log in.
				</p>
				<h3>Start playing</h3>
				<p>
					To play a game, you either create one yourself or join one
					already created. There are two categories of games, private
					and public. The public ones are listed in the Open games
					list, while the private ones require the creator to share a
					link for others to find them.
				</p>
				<h3>Player statistics</h3>
				<p>
					To raise the quality of games and to let people play with
					others of similiar persuasion the system tracks a lot of
					stats for each player, and allows game creators to limit the
					players able to join the game to players having stats in
					defined intervals.
				</p>
				<h4>Reliability</h4>
				<p>
					The most important of these is the Reliability statistic.
					Since a Diplomacy game where some players stop playing
					quickly becomes unbalanced, boring, and pointless, it is
					important to keep interacting with the game even when there
					isn't a chance of winning anymore, or when the other players
					have proven to be assholes, or when you just don't feel like
					it anymore. Just providing some random orders and submitting
					them is enough to make a huge positive difference.
				</p>
				<p>
					The reliability statistic is designed to reward active
					players by letting them join games with other active
					players. It works by calculating the number of active game
					phases divided by the number of inactive game phases, so
					that it represents the average number of phases between
					missing the deadline.
				</p>
				<p>
					When creating and joining games, it's recommended to (if
					possible when taking your own reliability into account)
					create and join games with a minimum reliability
					requirement of at least 10. This is helped by the minimum
					reliability of created games defaulting to your own
					reliability, or 10 if it's higher than 10.
				</p>
			</div>
		);
	}
}

