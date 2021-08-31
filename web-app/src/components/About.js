import React from "react";
import { Box, Typography } from "@material-ui/core";

export default class About extends React.Component {
	render() {
		return (
			<div
				id="scroller"
				style={{
					overflowY: "scroll",
					height: "calc(100% - 60px)",
					padding: "16px",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<div style={{ maxWidth: "520px", height: "100%" }}>
					<Typography variant={"h5"} style={{ marginBottom: "8px" }}>
						Diplomacy
					</Typography>
					<Typography
						variant={"body2"}
						style={{ marginBottom: "8px" }}
					>
						<a
							href="https://en.wikipedia.org/wiki/Diplomacy_(game)"
							target="_blank"
							rel="noreferrer"
						>
							Diplomacy
						</a>{" "}
						is a game invented in the 50's by{" "}
						<a
							href="https://en.wikipedia.org/wiki/Allan_B._Calhamer"
							target="_blank"
							rel="noreferrer"
						>
							Allan Calhamer
						</a>
						.
					</Typography>
					<Typography
						variant={"body2"}
						style={{ marginBottom: "8px" }}
					>
					<a href="https://diplicity.notion.site/How-to-play-39fbc4d1f1924c928c3953095062a983" target="_blank">Here you can find an introduction on how to play.</a>
					</Typography>
					<Typography
						variant={"body2"}
						style={{ marginBottom: "8px" }}
					>
						It looks like Risk, with a war map and units, but unlike
						Risk has no element of chance. All units have equal
						strength; the only way to win is to convince other
						players to help you (and ultimately betray them). This
						real, human connection is more important than the
						tactical aspect.
					</Typography>
					<Typography
						variant={"body2"}
						style={{ marginBottom: "8px" }}
					>
						During a turn, players play in parallel; firstly, during
						a fixed time, players just talk to each other (in groups
						or private); making alliances, agreements, pass
						information. During this phase they submit secret orders
						for their units.
					</Typography>
					<Typography
						variant={"body2"}
						style={{ marginBottom: "8px" }}
					>
						After the time ends, all orders are revealed
						simultaneously, showing who supported or betrayed who.
						Battles are resolved, units build or destroyed, and the
						next turn starts, until one player controls enough of
						the board to be the winner.
					</Typography>
					<Box style={{ fontWeight: "700", display: "block" }}>
						<Typography
							variant={"body2"}
							style={{ marginBottom: "32px" }}
						>
							{" "}
							This is why Diplicity games take a long time.
							'Playing' is mostly chatting with others. Turns
							usually take a day or more.
						</Typography>
					</Box>{" "}
					<Typography variant={"h5"} style={{ marginBottom: "8px" }}>
						Diplicity
					</Typography>
					<Typography variant={"body2"}>
						Diplicity is an open-source project that allows your to
						play Diplomacy online via both an{" "}
						<a
							href="https://play.google.com/store/apps/details?id=se.oort.diplicity"
							target="_blank"
							rel="noreferrer"
						>
							Android app
						</a>{" "}
						or{" "}
						<a
							href="http://www.diplicity.com"
							target="_blank"
							rel="noreferrer"
						>
							www.diplicity.com
						</a>
						.
					</Typography>
					<Typography variant={"body2"} paragraph>
						(Both are made by hobbyists who built this for free, in
						their spare time).
					</Typography>
					<Typography
						variant={"subtitle1"}
						style={{ fontWeight: "700" }}
					>
						How to start playing
					</Typography>
					<Typography variant={"body2"}>
						You either create a new game or join one already created
						(we suggest an almost full one).
					</Typography>
					<Typography variant={"body2"}>
						<i>Public games </i>are listed in the Open games list
						for anyone to join.
					</Typography>
					<Typography variant={"body2"} paragraph>
						<i>Private</i> games are unlisted and require members to
						share a link for others to join.
					</Typography>
					<Typography variant={"body2"}>
						Games will only start when full; this can sometimes take
						a long time.
					</Typography>
					<Typography variant={"body2"} paragraph>
						You can always invite others to speed this up using the
						share game link.
					</Typography>
					<Typography
						variant={"subtitle1"}
						style={{ fontWeight: "700" }}
					>
						Finding good matches
					</Typography>
					<Typography variant={"body2"} paragraph component={"span"}>
						To raise the quality of games, the system tracks a lot
						of stats and allows games to only allow players with
						certain stats. The most important is the{" "}
					</Typography>
					<Typography
						component={"span"}
						variant={"body2"}
						color="error"
						style={{ display: "inline", fontColor: "red" }}
					>
						Reliability statistic
					</Typography>{" "}
					<Typography variant={"body2"} component={"span"} paragraph>
						(explained below).
					</Typography>
					<Typography
						variant={"subtitle2"}
						style={{ fontWeight: "700" }}
					>
						Reliability
					</Typography>
					<Typography variant={"body2"}>
						Diplomacy is a game where players who stop responding
						make it unbalanced, boring, and no fun for anyone.
						Reliability awards active players by letting them join
						other active players.
					</Typography>
					<Typography variant={"body2"} paragraph>
						We recommend creating and joining games with a minimum
						reliability requirement of at least 10 (or as high as
						your reliability allows).
					</Typography>
					<Typography
						variant={"subtitle2"}
						style={{ fontWeight: "700" }}
					>
						Raising Reliability
					</Typography>
					<Typography variant={"body2"}>
						Your first game might have some players who don't
						respond.
					</Typography>
					<Typography variant={"body2"} paragraph>
						Even when losing, other players are assholes, or you
						don't feel like playing anymore, it's important to keep
						sending orders. This will raise your reliability so your
						next games can be of higher quality. Even submitting
						some random orders each turn is enough \ to make a huge
						positive difference to the game.
					</Typography>
					<Typography
						variant={"subtitle1"}
						style={{ fontWeight: "700" }}
					>
						Using Google Account Info
					</Typography>
					<Typography variant={"body2"}>
						We use your account name and avatar to refer to you when
						you interact with other players. After a public game
						ends,this info (together with your message history)
						becomes accessible to all Diplicity players.
						Unfortunately, we had to do this to reduce verbal abuse
						and keep the atmosphere friendly.
					</Typography>
					<Typography variant={"body2"} paragraph>
						If you do not want this, you can create a new, private
						game and play it with friends.
					</Typography>
					<Typography variant={"h5"} style={{ marginBottom: "8px" }}>
						Diplicity Development
					</Typography>
					<Typography variant={"body2"}>
						This app actually consists of multiple open source
						projects:
					</Typography>
					<Typography variant={"body2"}>
						<a
							href="https://github.com/zond/dipact"
							target="_blank"
							rel="noreferrer"
						>
							Dipact
						</a>
						, this user interface app that uses
					</Typography>
					<Typography variant={"body2"}>
						<a
							href="https://github.com/zond/diplicity"
							target="_blank"
							rel="noreferrer"
						>
							Diplicity
						</a>
						, a Diplomacy game service that uses
					</Typography>
					<Typography variant={"body2"} paragraph>
						<a
							href="https://github.com/zond/godip"
							target="_blank"
							rel="noreferrer"
						>
							Godip
						</a>
						, a Diplomacy judge service.
					</Typography>
					<Typography variant={"body2"} paragraph>
						A free instance of the Diplicity server is hosted at{" "}
						<a
							href="https://diplicity-engine.appspot.com/"
							target="_blank"
							rel="noreferrer"
						>
							https://diplicity-engine.appspot.com
						</a>
						, where you can find a simple and free RESTful JSON API
						to interact with Diplomacy games.
					</Typography>
					<Typography variant={"body2"} paragraph>
						We are currently focusing our efforts on{" "}
						<a
							href="https://github.com/zond/dipact"
							target="_blank"
							rel="noreferrer"
						>
							Dipact
						</a>
						, and are always happy with people who want to help (by
						developing, translating, designing, creating variants or
						otherwise). The project is run on a 'we make it because
						we like to make it' basis. If you want to contribute, we
						welcome you on our{" "}
						<a
							href="https://discord.com/channels/565625522407604254/697344626859704340"
							target="_blank"
							rel="noreferrer"
						>
							Discord server
						</a>
						.
					</Typography>
					<Typography variant={"body2"}>
						You can find the old version of the Android app
						("Droidippy") at{" "}
						<a
							href="https://github.com/zond/android-diplicity/releases"
							target="_blank"
							rel="noreferrer"
						>
							https://github.com/zond/android-diplicity/releases
						</a>
						.
					</Typography>
				</div>
			</div>
		);
	}
}
