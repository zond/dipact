/* eslint-disable no-restricted-globals */
import React from "react";
import gtag from "ga-gtag";
import {
	AppBar,
	Button,
	List,
	ListItem,
	ListSubheader,
	Slide,
	Toolbar,
	Typography,
} from "@material-ui/core";

import Globals from "../Globals";
import ErrorsDialog from "./ErrorsDialog";
import GameList from "./GameList";
import CreateGameDialog from "./CreateGameDialog";
import NewsDialog from "./NewsDialog";

import { ExpandIcon } from "../icons";
import LogoDarkSvgPath from "../static/img/logo_dark.svg";
import BattleGroundSvgPath from "../static/img/battleground.svg";
import CommanderSvgPath from "../static/img/commander.svg";

export default class GameMasterStart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.createGameDialog = null;
		this.masteredStagingGamesList = null;
		this.masteredStartedGamesList = null;
		this.masteredFinishedGamesList = null;

		this.hasGameMastered = this.hasGameMastered.bind(this);
	}
	hasGameMastered() {
		//TODO: This needs to validate that there is a GM game -- or empty state
		return (
			Globals.userStats.Properties.JoinedGames ||
			Globals.userStats.Properties.PrivateStats.JoinedGames
		);
	}
	componentDidMount() {
		gtag("set", {
			page_title: "GameMasterStart",
			page_location: location.href,
		});
		gtag("event", "page_view");
	}
	render() {
		return (
			<React.Fragment>
				{this.hasGameMastered() ? (
					<div
						style={{
							height: "calc(100vh - 60px)",
							overflowY: "scroll",
						}}
					>
						<List
							style={{
								maxWidth: "940px",
								margin: "auto",
								marginBottom: "64px",
							}}
						>
							<li key="mastered-started" id="mastered-started-container">
								<ul style={{ paddingInlineStart: 0 }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											paddingRight: "8px",
										}}
									>
										<ListSubheader
											style={{
												backgroundColor: "white",
												zIndex: "2",
												marginBottom: "2px",
												height: "44px",
												color: "rgba(40, 26, 26, 0.56)",
											}}
										>
											Ongoing games managed by me
										</ListSubheader>
									</div>
									<ListItem
										style={{
											padding: "0px 16px 4px 16px",
											width: "100%",
										}}
									>
										<GameList
											limit={128}
											contained={true}
											withDetails={true}
											url={this.props.urls["mastered-started-games"]}
											onPhaseMessage={(_) => {
												this.masteredStartedGamesList.refresh();
												this.masteredFinishedGamesList.refresh();
											}}
											parentCB={(c) => {
												this.masteredStartedGamesList = c;
											}}
											onFilled={(_) => {
												document.getElementById(
													"mastered-started-container"
												).style.display = "block";
											}}
											onEmpty={(_) => {
												document.getElementById(
													"mastered-started-container"
												).style.display = "none";
											}}
										/>
									</ListItem>
								</ul>
							</li>
							<li key="mastered-staging" id="mastered-staging-container">
								<ul style={{ paddingInlineStart: 0 }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											paddingRight: "8px",
										}}
									>
										<ListSubheader
											style={{
												backgroundColor: "white",
												zIndex: "2",
												marginBottom: "2px",
												height: "44px",
												color: "rgba(40, 26, 26, 0.56)",
											}}
										>
											Forming games managed by me
										</ListSubheader>
									</div>

									<ListItem
										style={{
											padding: "0px 16px",
										}}
									>
										<GameList
											limit={128}
											contained={true}
											onPhaseMessage={(_) => {
												this.masteredStartedGamesList.reload();
												this.masteredStagingGamesList.reload();
											}}
											onFilled={(_) => {
												document.getElementById(
													"mastered-staging-container"
												).style.display = "block";
											}}
											withDetails={true}
											onEmpty={(_) => {
												document.getElementById(
													"mastered-staging-container"
												).style.display = "none";
											}}
											parentCB={(c) => {
												this.masteredStagingGamesList = c;
											}}
											url={this.props.urls["mastered-staging-games"]}
										/>
									</ListItem>
								</ul>
							</li>
							<li key="mastered-finished" id="mastered-finished-container">
								<ul style={{ paddingInlineStart: 0 }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											paddingRight: "8px",
										}}
									>
										<ListSubheader
											style={{
												backgroundColor: "white",
												zIndex: "2",
												marginBottom: "2px",
												height: "44px",
												color: "rgba(40, 26, 26, 0.56)",
											}}
										>
											Finished games managed by me
										</ListSubheader>
										<Button onClick={this.props.renderMasteredFinishedGames}>
											View all
										</Button>
									</div>

									<ListItem
										style={{
											padding: "0px 16px 4px 16px",
										}}
									>
										<GameList
											contained={true}
											parentCB={(c) => {
												this.masteredFinishedGamesList = c;
											}}
											onFilled={(_) => {
												document.getElementById(
													"mastered-finished-container"
												).style.display = "block";
											}}
											onEmpty={(_) => {
												document.getElementById(
													"mastered-finished-container"
												).style.display = "none";
											}}
											url={this.props.urls["mastered-finished-games"]}
											limit={8}
										/>
									</ListItem>
								</ul>
							</li>
						</List>
												<AppBar
							position="fixed"
							color="primary"
							style={{ top: "auto", bottom: 0 }}
						>
							<Toolbar style={{ justifyContent: "space-around" }}>
									<Button
										style={{ margin: 4 }}
										variant="outlined"
										color="secondary"
										key="create"
										onClick={(_) => {
											this.createGameDialog.setState({
												open: true,
											});
										}}
									>
										Create game
									</Button>
							</Toolbar>
						</AppBar>
					</div>
				) : (
					<React.Fragment>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								height: "calc(100vh - 54px)",
								overflowY: "scroll",
								backgroundColor: "#FDE2B5",
							}}
						>
							<div
								id="top"
								style={{
									margin: "auto",
									width: "100%",
									maxWidth: "400px",
									alignSelf: "center",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography
									variant="h5"
									style={{ alignSelf: "center", padding: "16px" }}
								>
									My Managed Games
								</Typography>

								<Typography
									variant="body2"
									style={{
										margin: "0px 16px 16px 16px",
									}}
								>
									Games which you manage as Game Master (GM) will appear here.
									<br />
									<br />
									As GM, you manage a game: who can join (as what nation), time
									(set deadlines, pause and resume), active players (kick and
									replace).
									<br />
									This is for tournaments or games with friends, but not for
									public games (risk of abuse).
								</Typography>
								<Button
									style={{
										margin: "16px auto",
										minWidth: "200px",
									}}
									color="primary"
									variant="outlined"
									key="create"
									onClick={(_) => {
										this.createGameDialog.setState({
											open: true,
										});
									}}
								>
									Create new game
								</Button>
							</div>
							<div id="bottom">
								<div
									style={{
										backgroundImage: `url(${BattleGroundSvgPath})`,
										height: "72px",
									}}
								>
									<div
										style={{
											backgroundImage: `url(${CommanderSvgPath})`,
											backgroundRepeat: "no-repeat",
											height: "72px",
										}}
									></div>
								</div>
								<div
									style={{
										backgroundColor: "#291B1B",
										display: "flex",
										flexDirection: "column",
										paddingBottom: "124px",
									}}
								></div>
							</div>
						</div>
					</React.Fragment>
				)}
				<CreateGameDialog
					gameCreated={(game) => {
						if (game.Properties.GameMasterEnabled) {
//TODO: IF GAMEMASTERGAME CLOSE THE CREATEGAMEDIALOG
						} else {
//TODO: IF NO GAMEMASTERGAME CLOSE THE CREATEGAMEDIALOG AND LOAD START.JS AS ACTIVITY
						}
					}}
					parentCB={(c) => {
						this.createGameDialog = c;
					}}
				/>
			</React.Fragment>
		);
	}
}
