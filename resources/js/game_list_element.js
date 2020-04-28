import * as helpers from '%{ cb "/js/helpers.js" }%';

import Game from '%{ cb "/js/game.js" }%';
import UserAvatar from '%{ cb "/js/user_avatar.js" }%';
import NationPreferencesDialog from '%{ cb "/js/nation_preferences_dialog.js" }%';

export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			game: this.props.game,
			viewOpen: false,
			member: props.game.Properties.Members.find(e => {
				return e.User.Email == Globals.user.Email;
			})
		};
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.nationPreferencesDialog = null;
		this.valignClass = helpers.scopedClass(
			"display: flex; align-items: center;"
		);
		this.viewGame = this.viewGame.bind(this);
		this.closeGame = this.closeGame.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.leaveGame = this.leaveGame.bind(this);
		this.joinGameWithPreferences = this.joinGameWithPreferences.bind(this);
		this.reloadGame = this.reloadGame.bind(this);
		this.phaseMessageHandler = this.phaseMessageHandler.bind(this);
		this.messageHandler = this.messageHandler.bind(this);
		this.dead = false;
	}
	messageHandler(payload) {
		if (payload.data.message.GameID != this.props.game.Properties.ID) {
			return false;
		}
		this.reloadGame();
		return false;
	}
	phaseMessageHandler(payload) {
		if (payload.data.gameID != this.state.game.Properties.ID) {
			return false;
		}
		this.reloadGame();
		return false;
	}
	componentWillUnmount() {
		Globals.messaging.unsubscribe("phase", this.phaseMessageHandler);
		Globals.messaging.unsubscribe("message", this.messageHandler);
	}
	componentDidMount() {
		Globals.messaging.subscribe("phase", this.phaseMessageHandler);
		Globals.messaging.subscribe("message", this.messageHandler);
	}
	joinGameWithPreferences(link, preferences) {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method,
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						NationPreferences: preferences.join(",")
					})
				})
			)
			.then(_ => {
				helpers.decProgress();
				Globals.messaging.start();
				this.reloadGame();
			});
	}
	reloadGame() {
		helpers
			.safeFetch(
				helpers.createRequest(
					this.state.game.Links.find(l => {
						return l.Rel == "self";
					}).URL
				)
			)
			.then(resp => resp.json())
			.then(js => {
				this.setState({
					game: js,
					member: js.Properties.Members.find(e => {
						return e.User.Email == Globals.user.Email;
					})
				});
			});
	}
	leaveGame(link) {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method
				})
			)
			.then(resp => resp.json())
			.then(_ => {
				helpers.decProgress();
				if (this.state.game.Properties.Members.length > 1) {
					this.reloadGame();
				} else {
					this.dead = true;
					this.setState((state, props) => {
						state = Object.assign({}, state);
						state.game.Links = [];
						return state;
					});
				}
			});
	}
	joinGame(link) {
		if (this.state.game.Properties.NationAllocation == 1) {
			this.nationPreferencesDialog.setState({
				open: true,
				nations: this.variant.Properties.Nations,
				onSelected: preferences => {
					this.joinGameWithPreferences(link, preferences);
				}
			});
		} else {
			this.joinGameWithPreferences(link, []);
		}
	}
	closeGame() {
		this.setState({ viewOpen: false });
	}
	viewGame(e) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({ viewOpen: true });
	}
	addIcon(ary, codepoint, color) {
		ary.push(
			helpers.createIcon(codepoint, {
				padding: "4px 1px 0px 1px",
				color: color,
				fontSize: "14px"
			})
		);
	}
	getIcons() {
		let itemKey = 0;
		let icons = [];
		if (
			this.state.game.Properties.MinQuickness ||
			this.state.game.Properties.MinReliability
		) {
			this.addIcon(icons, "\ue425", "black");
		}
		if (
			this.state.game.Properties.MinRating ||
			this.state.game.Properties.MaxRating
		) {
			this.addIcon(icons, "\ue83a", "black");
		}
		if (
			this.state.game.Properties.MaxHater ||
			this.state.game.Properties.MaxHated
		) {
			icons.push(
				<MaterialUI.Tooltip
					key={itemKey++}
					disableFocusListener
					title="Maximum hate requirement"
				>
					<MaterialUI.SvgIcon
						style={{ height: "16px", width: "16px" }}
					>
						<g
							id="Artboard"
							stroke="none"
							strokeWidth="1"
							fill="none"
							fillRule="evenodd"
						>
							<g
								id="emoticon-angry-outline"
								transform="translate(2.000000, 2.000000)"
								fill="#000000"
								fillRule="nonzero"
							>
								<path
									d="M1.499,0.115 L19.2847763,17.8994949 L19.299,17.885 L19.8994949,18.4852814 L18.4852814,19.8994949 L16.3286725,17.7426435 C14.5506593,19.1960497 12.3167744,20 10,20 C7.3478351,20 4.80429597,18.9464316 2.92893219,17.0710678 C1.0535684,15.195704 0,12.6521649 0,10 C0,7.59864107 0.846427847,5.39497595 2.25721107,3.67107713 L0.100505063,1.51471863 L1.499,0.115 Z M3.68005389,5.09447025 C2.62704639,6.44913544 2,8.15134045 2,10 C2,14.418278 5.581722,18 10,18 C11.8486595,18 13.5508646,17.3729536 14.9055298,16.3199461 L13.293,14.707 L12.77,15.23 C12.32,14.5 11.25,14 10,14 C8.75,14 7.68,14.5 7.23,15.23 L5.81,13.81 C6.71,12.72 8.25,12 10,12 C10.2091413,12 10.4152832,12.0102834 10.6176919,12.0302527 L7.32314129,8.73840737 C7.08353442,8.90238797 6.7987395,9 6.5,9 C5.7,9 5,8.3 5,7.5 L5,6.414 L3.68005389,5.09447025 Z M10,0 C12.6521649,0 15.195704,1.0535684 17.0710678,2.92893219 C18.9464316,4.80429597 20,7.3478351 20,10 C20,11.6325537 19.6007944,13.2239482 18.8564416,14.6436748 L17.3584074,13.144315 C17.7713793,12.1791202 18,11.1162587 18,10 C18,7.87826808 17.1571453,5.84343678 15.6568542,4.34314575 C14.1565632,2.84285472 12.1217319,2 10,2 C8.88374129,2 7.82087979,2.22862069 6.85568497,2.64159261 L5.35539972,1.1417664 C6.74323813,0.41258719 8.32343661,0 10,0 Z M15,6 L15,7.5 C15,8.3 14.3,9 13.5,9 C12.7,9 12,8.3 12,7.5 L15,6 Z"
									id="Combined-Shape"
								></path>
							</g>
						</g>
					</MaterialUI.SvgIcon>
				</MaterialUI.Tooltip>
			);
		}
		if (
			this.state.game.Properties.DisableConferenceChat ||
			this.state.game.Properties.DisableGroupChat ||
			this.state.game.Properties.DisablePrivateChat
		) {
			icons.push(
				<MaterialUI.Tooltip
					key={itemKey++}
					disableFocusListener
					title="Chat disabled"
				>
					<MaterialUI.SvgIcon
						style={{ height: "16px", width: "16px" }}
					>
						<g
							id="Artboard"
							stroke="none"
							strokeWidth="1"
							fill="none"
							fillRule="evenodd"
						>
							<g id="message-24px">
								<polygon
									id="Path"
									points="0 0 24 0 24 24 0 24"
								></polygon>
								<path
									d="M2.4,2.614 L20.5847763,20.7989899 L20.598,20.784 L20.7989899,20.9842712 L19.3847763,22.3984848 L14.986,18 L6,18 L2,22 L2.008,5.022 L1,4.0137085 L2.4,2.614 Z M20,2 C21.05,2 21.9177686,2.82004132 21.9944872,3.85130541 L22,4 L22,16 C22,16.9134058 21.3794387,17.6889091 20.539101,17.925725 L16.614,14 L18,14 L18,12 L14.614,12 L13.614,11 L18,11 L18,9 L11.614,9 L10.614,8 L18,8 L18,6 L8.614,6 L4.614,2 L20,2 Z M8.987,12 L6,12 L6,14 L10.986,14 L8.987,12 Z M6,9.013 L6,11 L7.987,11 L6,9.013 Z"
									id="Combined-Shape"
									fill="#000000"
									fillRule="nonzero"
								></path>
							</g>
						</g>
					</MaterialUI.SvgIcon>
				</MaterialUI.Tooltip>
			);
		}
		if (this.state.game.Properties.Private) {
			this.addIcon(icons, "\ue897", "black");
		}
		if (this.state.game.Properties.NationAllocation == 1) {
			this.addIcon(icons, "\ue065", "black");
		}
		return <MaterialUI.Box display="inline">{icons}</MaterialUI.Box>;
	}

	render() {
		let expandedGameCells = [];
		expandedGameCells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
			>
				<MaterialUI.Icon style={{ marginRight: "8px" }}>
					{helpers.createIcon("\ue55b")}
				</MaterialUI.Icon>
				<MaterialUI.Typography>
					Game variant: {this.state.game.Properties.Variant}
				</MaterialUI.Typography>
			</div>
		);
		if (this.state.game.Properties.LastYear) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue88b")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Ends after year: {this.state.game.Properties.LastYear}
					</MaterialUI.Typography>
				</div>
			);
		}
		expandedGameCells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
			>
				<MaterialUI.Icon style={{ marginRight: "8px" }}>
					<MaterialUI.SvgIcon>
						<g
							id="Artboard"
							stroke="none"
							strokeWidth="1"
							fill="none"
							fillRule="evenodd"
						>
							<g id="timelapse-24px">
								<polygon
									id="Path"
									points="0 0 24 0 24 24 0 24"
								></polygon>
								<path
									d="M12,6 C12.5719312,6 13.1251722,6.08002251 13.6491373,6.22948186 L12,12 Z M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M12,20 C7.58,20 4,16.42 4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 Z"
									id="Shape"
									fill="#000000"
									fillRule="nonzero"
								></path>
							</g>
						</g>
					</MaterialUI.SvgIcon>
				</MaterialUI.Icon>
				<MaterialUI.Typography>
					Created:{" "}
					{helpers.timeStrToDate(
						this.state.game.Properties.CreatedAt
					)}{" "}
				</MaterialUI.Typography>
			</div>
		);
		if (this.state.game.Properties.Started) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue422")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Started:{" "}
						{helpers.timeStrToDate(
							this.state.game.Properties.StartedAt
						)}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.state.game.Properties.Finished) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						<MaterialUI.SvgIcon>
							<g
								id="Artboard"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g id="timelapse-24px">
									<polygon
										id="Path"
										points="0 0 24 0 24 24 0 24"
									></polygon>
									<path
										d="M12,6 C15.3137085,6 18,8.6862915 18,12 C18,15.3137085 15.3137085,18 12,18 C8.6862915,18 6,15.3137085 6,12 C6,9.25822274 7.83903025,6.94597402 10.3508627,6.22948186 L12,12 Z M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M12,20 C7.58,20 4,16.42 4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 Z"
										id="Shape"
										fill="#000000"
										fillRule="nonzero"
									></path>
								</g>
							</g>
						</MaterialUI.SvgIcon>
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Finished:{" "}
						{helpers.timeStrToDate(
							this.state.game.Properties.FinishedAt
						)}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		expandedGameCells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
			>
				{this.state.game.Properties.NationAllocation == 1 ? (
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue065")}
					</MaterialUI.Icon>
				) : (
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						<MaterialUI.SvgIcon>
							<g
								id="Artboard"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g id="playlist_add_check-24px-(1)">
									<rect
										id="Rectangle"
										x="0"
										y="0"
										width="24"
										height="24"
									></rect>
									<path
										d="M14,10 L2,10 L2,12 L14,12 L14,10 Z M14,6 L2,6 L2,8 L14,8 L14,6 Z M18.51,16.25 L21,18.75 L18.51,21.25 L18.51,19.5 L13,19.5 L13,18 L18.51,18 L18.51,16.25 Z M15.49,12 L15.49,13.75 L21,13.75 L21,15.25 L15.49,15.25 L15.49,17 L13,14.5 L15.49,12 Z M10,14 L10,16 L2,16 L2,14 L10,14 Z"
										id="Shape"
										fill="#000000"
										fillRule="nonzero"
									></path>
								</g>
								<g id="loop-24px">
									<polygon
										id="Path"
										points="13 12 26 12 26 25 13 25"
									></polygon>
									<g id="transfer_within_a_station-24px">
										<polygon
											id="Path"
											points="0 0 24 0 24 24 0 24"
										></polygon>
									</g>
								</g>
							</g>
						</MaterialUI.SvgIcon>
					</MaterialUI.Icon>
				)}

				<MaterialUI.Typography>
					Nation selection:{" "}
					{this.state.game.Properties.NationAllocation == 1
						? "Preferences"
						: "Random"}{" "}
				</MaterialUI.Typography>
			</div>
		);

		if (this.state.game.Properties.MinRating) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue83a")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Minimum rating: {this.state.game.Properties.MinRating}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MaxRating) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue83a")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Maximum rating: {this.state.game.Properties.MaxRating}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MinReliability) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue425")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Minimum reliability:{" "}
						{this.state.game.Properties.MinReliability}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MinQuickness) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue425")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Minimum quickness:{" "}
						{this.state.game.Properties.MinQuickness}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MaxHated) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						<MaterialUI.SvgIcon>
							<g
								id="Artboard"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g
									id="emoticon-angry-outline"
									transform="translate(1.000000, 1.000000)"
									fill="#000000"
									fillRule="nonzero"
								>
									<path
										d="M1.05,0.08 L13.4993434,12.5296465 L13.509,12.519 L13.9296465,12.939697 L12.939697,13.9296465 L11.4291042,12.4206404 C10.184652,13.4375261 8.62132228,14 7,14 C5.14348457,14 3.36300718,13.2625021 2.05025253,11.9497475 C0.737497883,10.6369928 0,8.85651543 0,7 C0,5.31921341 0.592383418,3.77678538 1.57975754,2.57010863 L0.0703535444,1.06030304 L1.05,0.08 Z M2.5761358,3.566003 C1.83897141,4.51428911 1.4,5.70588092 1.4,7 C1.4,10.0927946 3.9072054,12.6 7,12.6 C8.29411908,12.6 9.48571089,12.1610286 10.433997,11.4238642 L9.305,10.295 L8.939,10.661 C8.624,10.15 7.875,9.8 7,9.8 C6.125,9.8 5.376,10.15 5.061,10.661 L4.067,9.667 C4.697,8.904 5.775,8.4 7,8.4 C7.14658996,8.4 7.29107491,8.40721717 7.43293907,8.42123168 L5.12607623,6.1169691 C4.95837689,6.23170489 4.75906667,6.3 4.55,6.3 C3.99,6.3 3.5,5.81 3.5,5.25 L3.5,4.49 L2.5761358,3.566003 Z M7,0 C8.85651543,0 10.6369928,0.737497883 11.9497475,2.05025253 C13.2625021,3.36300718 14,5.14348457 14,7 C14,8.14229525 13.7207968,9.25580388 13.2001824,10.2492879 L12.1507771,9.20127306 C12.4399256,8.52556954 12.6,7.78147846 12.6,7 C12.6,5.51478766 12.0100017,4.09040574 10.959798,3.04020203 C9.90959426,1.98999831 8.48521234,1.4 7,1.4 C6.21813639,1.4 5.47369701,1.56023219 4.79772792,1.84965051 L3.74828763,0.799495095 C4.71989309,0.288908589 5.82620744,0 7,0 Z M10.5,4.2 L10.5,5.25 C10.5,5.81 10.01,6.3 9.45,6.3 C8.89,6.3 8.4,5.81 8.4,5.25 L10.5,4.2 Z"
										id="Combined-Shape"
									></path>
								</g>
							</g>
						</MaterialUI.SvgIcon>
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Maximum hated:
						{this.state.game.Properties.MaxHated}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MaxHater) {
			expandedGameCells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center"
					}}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						<MaterialUI.SvgIcon>
							<g
								id="Artboard"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g
									id="emoticon-angry-outline"
									transform="translate(1.000000, 1.000000)"
									fill="#000000"
									fillRule="nonzero"
								>
									<path
										d="M1.05,0.08 L13.4993434,12.5296465 L13.509,12.519 L13.9296465,12.939697 L12.939697,13.9296465 L11.4291042,12.4206404 C10.184652,13.4375261 8.62132228,14 7,14 C5.14348457,14 3.36300718,13.2625021 2.05025253,11.9497475 C0.737497883,10.6369928 0,8.85651543 0,7 C0,5.31921341 0.592383418,3.77678538 1.57975754,2.57010863 L0.0703535444,1.06030304 L1.05,0.08 Z M2.5761358,3.566003 C1.83897141,4.51428911 1.4,5.70588092 1.4,7 C1.4,10.0927946 3.9072054,12.6 7,12.6 C8.29411908,12.6 9.48571089,12.1610286 10.433997,11.4238642 L9.305,10.295 L8.939,10.661 C8.624,10.15 7.875,9.8 7,9.8 C6.125,9.8 5.376,10.15 5.061,10.661 L4.067,9.667 C4.697,8.904 5.775,8.4 7,8.4 C7.14658996,8.4 7.29107491,8.40721717 7.43293907,8.42123168 L5.12607623,6.1169691 C4.95837689,6.23170489 4.75906667,6.3 4.55,6.3 C3.99,6.3 3.5,5.81 3.5,5.25 L3.5,4.49 L2.5761358,3.566003 Z M7,0 C8.85651543,0 10.6369928,0.737497883 11.9497475,2.05025253 C13.2625021,3.36300718 14,5.14348457 14,7 C14,8.14229525 13.7207968,9.25580388 13.2001824,10.2492879 L12.1507771,9.20127306 C12.4399256,8.52556954 12.6,7.78147846 12.6,7 C12.6,5.51478766 12.0100017,4.09040574 10.959798,3.04020203 C9.90959426,1.98999831 8.48521234,1.4 7,1.4 C6.21813639,1.4 5.47369701,1.56023219 4.79772792,1.84965051 L3.74828763,0.799495095 C4.71989309,0.288908589 5.82620744,0 7,0 Z M10.5,4.2 L10.5,5.25 C10.5,5.81 10.01,6.3 9.45,6.3 C8.89,6.3 8.4,5.81 8.4,5.25 L10.5,4.2 Z"
										id="Combined-Shape"
									></path>
								</g>
							</g>
						</MaterialUI.SvgIcon>
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Maximum hater: {this.state.game.Properties.MaxHater}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (
			this.state.game.Properties.DisableConferenceChat ||
			this.state.game.Properties.DisableGroupChat ||
			this.state.game.Properties.DisablePrivateChat
		) {
			if (
				this.state.game.Properties.DisableConferenceChat &&
				this.state.game.Properties.DisableGroupChat &&
				this.state.game.Properties.DisablePrivateChat
			) {
				// Add two columns because this is required for formatting nicely.
				expandedGameCells.push(
					<div
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center"
						}}
					>
						<MaterialUI.Icon style={{ marginRight: "8px" }}>
							<MaterialUI.SvgIcon>
								<g
									id="Artboard"
									stroke="none"
									strokeWidth="1"
									fill="none"
									fillRule="evenodd"
								>
									<g id="message-24px">
										<polygon
											id="Path"
											points="0 0 24 0 24 24 0 24"
										></polygon>
										<path
											d="M2.4,2.614 L20.5847763,20.7989899 L20.598,20.784 L20.7989899,20.9842712 L19.3847763,22.3984848 L14.986,18 L6,18 L2,22 L2.008,5.022 L1,4.0137085 L2.4,2.614 Z M20,2 C21.05,2 21.9177686,2.82004132 21.9944872,3.85130541 L22,4 L22,16 C22,16.9134058 21.3794387,17.6889091 20.539101,17.925725 L16.614,14 L18,14 L18,12 L14.614,12 L13.614,11 L18,11 L18,9 L11.614,9 L10.614,8 L18,8 L18,6 L8.614,6 L4.614,2 L20,2 Z M8.987,12 L6,12 L6,14 L10.986,14 L8.987,12 Z M6,9.013 L6,11 L7.987,11 L6,9.013 Z"
											id="Combined-Shape"
											fill="#000000"
											fillRule="nonzero"
										></path>
									</g>
								</g>
							</MaterialUI.SvgIcon>
						</MaterialUI.Icon>
						<MaterialUI.Typography>
							No chat (Gunboat)
						</MaterialUI.Typography>
					</div>
				);
			} else {
				// Sort channel types by whether they're enabled or disabled.
				let allChannels = { false: [], true: [] };
				allChannels[
					this.state.game.Properties.DisableConferenceChat
				].push("Conference");
				allChannels[this.state.game.Properties.DisableGroupChat].push(
					"Group"
				);
				allChannels[this.state.game.Properties.DisablePrivateChat].push(
					"Private"
				);
				expandedGameCells.push(
					<div
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center"
						}}
					>
						<MaterialUI.Icon style={{ marginRight: "8px" }}>
							<MaterialUI.SvgIcon>
								<g
									id="Artboard"
									stroke="none"
									strokeWidth="1"
									fill="none"
									fillRule="evenodd"
								>
									<g id="message-24px">
										<polygon
											id="Path"
											points="0 0 24 0 24 24 0 24"
										></polygon>
										<path
											d="M2.4,2.614 L20.5847763,20.7989899 L20.598,20.784 L20.7989899,20.9842712 L19.3847763,22.3984848 L14.986,18 L6,18 L2,22 L2.008,5.022 L1,4.0137085 L2.4,2.614 Z M20,2 C21.05,2 21.9177686,2.82004132 21.9944872,3.85130541 L22,4 L22,16 C22,16.9134058 21.3794387,17.6889091 20.539101,17.925725 L16.614,14 L18,14 L18,12 L14.614,12 L13.614,11 L18,11 L18,9 L11.614,9 L10.614,8 L18,8 L18,6 L8.614,6 L4.614,2 L20,2 Z M8.987,12 L6,12 L6,14 L10.986,14 L8.987,12 Z M6,9.013 L6,11 L7.987,11 L6,9.013 Z"
											id="Combined-Shape"
											fill="#000000"
											fillRule="nonzero"
										></path>
									</g>
								</g>
							</MaterialUI.SvgIcon>
						</MaterialUI.Icon>
						<MaterialUI.Typography>
							{" "}
							{allChannels[false].join(" & ")} chat off
						</MaterialUI.Typography>
					</div>
				);
				expandedGameCells.push(
					<div
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center"
						}}
					>
						<MaterialUI.Icon style={{ marginRight: "8px" }}>
							{helpers.createIcon("\ue0c9")}
						</MaterialUI.Icon>
						<MaterialUI.Typography>
							{" "}
							{allChannels[true].join(" & ")} chat on{" "}
						</MaterialUI.Typography>
					</div>
				);
			}
		}
		let expandedGameItems = [];
		let itemKey = 0;

		let buttons = [];

		if (!this.dead) {
			buttons.push(
				<MaterialUI.Button
					variant="outlined"
					style={{ marginRight: "16px", minWidth: "100px" }}
					color="primary"
					onClick={this.viewGame}
					key={itemKey++}
				>
					View
				</MaterialUI.Button>
			);
		}
		this.state.game.Links.forEach(link => {
			if (link.Rel == "join") {
				if (this.state.game.Properties.PhaseLengthMinutes < 60 * 12) {
					buttons.unshift(
						<MaterialUI.Typography
							key="deadline_warning"
							className={helpers.scopedClass("color: red;")}
						>
							WARNING: This game has a phase deadline of less than
							12 hours. If you are away from your device when the
							game starts (or when a phase resolves) you may tank
							your reliability rating, and potentially miss the
							entire game.
						</MaterialUI.Typography>
					);
				}
                                if (this.state.game.Properties.MinReliability == 0 &&
                                    Globals.userStats.Properties.Reliability >= 10) {
                                        buttons.unshift(
						<MaterialUI.Typography
							key="reliability_warning"
							className={helpers.scopedClass("color: red;")}
						>
							WARNING: This game has no reliability requirements,
						        which means it will likely have one or more absent
                                                        players. Since you have a reliability > 10, you have
                                                        a wide selection of more reliable games to join.
						</MaterialUI.Typography>
					);
                                }
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						variant="outlined"
						color="primary"
						style={{ marginRight: "16px", minWidth: "100px" }}
						onClick={_ => {
							this.joinGame(link);
						}}
					>
						Join
					</MaterialUI.Button>
				);
			} else if (link.Rel == "leave") {
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						variant="outlined"
						color="primary"
						style={{ marginRight: "16px", minWidth: "100px" }}
						onClick={_ => {
							this.leaveGame(link);
						}}
					>
						Leave
					</MaterialUI.Button>
				);
			}
		});
		expandedGameItems.push(
			<div
				key={itemKey++}
				style={{
					dispay: "flex",
					justifyContent: "space-evenly",
					marginBottom: "8px"
				}}
			>
				{buttons}
			</div>
		);
		expandedGameCells.forEach(cell =>
			expandedGameItems.push(<div key={itemKey++}>{cell}</div>)
		);

		let playerList = [];
		playerList.push(
			<MaterialUI.Typography
				key={itemKey++}
				variant="subtitle2"
				style={{ color: "rgba(40, 26, 26, 0.7)", marginTop: "4px" }}
			>
				Players:
			</MaterialUI.Typography>
		);

		this.state.game.Properties.Members.forEach(member => {
			playerList.push(
				<div
					key={itemKey++}
					style={{ display: "flex", alignItems: "center" }}
				>
					<UserAvatar user={member.User} />
					<MaterialUI.Typography>
						{member.User.GivenName} {member.User.FamilyName}
					</MaterialUI.Typography>
				</div>
			);
		});

		let summary = (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",

					marginTop: "8px"
				}}
			>
				{(_ => {
					if (this.state.game.Properties.Started) {
						return (
							<React.Fragment>
								{/* IF STARTED */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between"
									}}
								>
									{this.state.member &&
									this.state.member.UnreadMessages > 0 ? (
										<MaterialUI.Badge
											key={itemKey++}
											badgeContent={
												this.state.member.UnreadMessages
											}
											color="primary"
											style={{
												maxWidth: "calc(100% - 70px)"
											}}
										>
											<MaterialUI.Typography
												textroverflow="ellipsis"
												noWrap
												style={{
													color: "rgba(40, 26, 26, 1)"
												}}
											>
												{helpers.gameDesc(
													this.state.game
												)}
											</MaterialUI.Typography>
										</MaterialUI.Badge>
									) : (
										<MaterialUI.Typography
											key={itemKey++}
											textroverflow="ellipsis"
											noWrap={true}
											style={{
												minWidth: "60px",
												color: "rgba(40, 26, 26, 1)"
											}}
										>
											{helpers.gameDesc(this.state.game)}
										</MaterialUI.Typography>
									)}

									<div
										id="Timer"
										key={itemKey++}
										style={{
											alignSelf: "center",
											display: "flex",
											alignItems: "center",
											color: "#281A1A"
										}}
									>
										{this.state.member != null &&
										this.state.game.Properties.Started &&
										!this.state.game.Properties.Finished ? (
											this.state.member.NewestPhaseState
												.OnProbation ? (
												<MaterialUI.SvgIcon>
													<path
														d="M2.98188996,2.24133335 L21.3666663,20.6261097 L20.0261097,21.9666663 L19.0573333,20.998 L19,21 L5,21 C3.95,21 3.0822314,20.1799587 3.00551277,19.1486946 L3,19 L3,5 L3.00233335,4.942 L1.64133335,3.58188996 L2.98188996,2.24133335 Z M12,1 C13.235,1 14.2895,1.7581 14.75196,2.828465 L14.82,3 L19,3 C20.05,3 20.9177686,3.82004132 20.9944872,4.85130541 L21,5 L21,17.963 L16.037,13 L17,13 L17,11 L14.037,11 L12.037,9 L17,9 L17,7 L10.037,7 L6.037,3 L9.18,3 C9.579,1.898 10.5917,1.0848 11.80656,1.006235 L12,1 Z M13.0593333,15 L7,15 L7,17 L15.0593333,17 L13.0593333,15 Z M11.0593333,13 L9.06033335,11 L7,11 L7,13 L11.0593333,13 Z M12,3 C11.45,3 11,3.45 11,4 C11,4.55 11.45,5 12,5 C12.55,5 13,4.55 13,4 C13,3.45 12.55,3 12,3 Z"
														id="Shape"
														fill="#b71c1c"
														fillRule="nonzero"
													></path>
												</MaterialUI.SvgIcon>
											) : this.state.member
													.NewestPhaseState
													.ReadyToResolve ? (
												<MaterialUI.SvgIcon>
													<path
														d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M13.4347826,7 L7.70608696,12.7391304 L4.56521739,9.60869565 L3,11.173913 L7.70608696,15.8695652 L15,8.56521739 L13.4347826,7 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
														fill="#281A1A"
														id="Combined-Shape"
													></path>
												</MaterialUI.SvgIcon>
											) : (
												helpers.createIcon("\ue422")
											)
										) : (
											""
										)}
										<MaterialUI.Typography
											variant="body2"
											style={{
												paddingLeft: "2px",
												color: "rgba(40, 26, 26, 1)"
											}}
										>
											{this.state.game.Properties.Finished
												? helpers.minutesToDuration(
														-this.state.game
															.Properties
															.FinishedAgo /
															1000000000 /
															60,
														true
												  )
												: helpers.minutesToDuration(
														this.state.game
															.Properties
															.NewestPhaseMeta[0]
															.NextDeadlineIn /
															1000000000 /
															60,
														true
												  )}
										</MaterialUI.Typography>
									</div>
								</div>
								<div
									key={itemKey++}
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										flexWrap: "wrap"
									}}
								>
									<MaterialUI.Typography
										textroverflow="ellipsis"
										noWrap={true}
										display="inline"
										variant="caption"
										id="variant"
										style={{
											color: "rgba(40, 26, 26, 0.7)"
										}}
									>
										{this.state.game.Properties.Variant}{" "}
										{helpers.minutesToDuration(
											this.state.game.Properties
												.PhaseLengthMinutes
										)}
									</MaterialUI.Typography>
									<MaterialUI.Typography
										variant="caption"
										style={{
											color: "rgba(40, 26, 26, 0.7)"
										}}
									>
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Season
										}{" "}
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Year
										}
										,{" "}
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Type
										}
									</MaterialUI.Typography>
								</div>
							</React.Fragment>
						);
					} else {
						return (
							<React.Fragment>
								{/* IF STARTED */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between"
									}}
								>
									<MaterialUI.Typography
										key={itemKey++}
										textroverflow="ellipsis"
										noWrap={true}
										style={{}}
									>
										{helpers.gameDesc(this.state.game)}
									</MaterialUI.Typography>

									<div
										id="Join"
										key={itemKey++}
										style={{
											alignSelf: "center",
											display: "flex",
											alignItems: "center"
										}}
									>
										{helpers.createIcon("\ue7fb")}{" "}
										<MaterialUI.Typography
											variant="body2"
											style={{ paddingLeft: "2px" }}
										>
											{
												this.state.game.Properties
													.NMembers
											}
											/
											{
												this.variant.Properties.Nations
													.length
											}{" "}
										</MaterialUI.Typography>
									</div>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between"
									}}
								>
									<MaterialUI.Typography
										textroverflow="ellipsis"
										noWrap={true}
										display="inline"
										variant="caption"
										style={{
											color: "rgba(40, 26, 26, 0.7)"
										}}
									>
										{this.state.game.Properties.Variant}{" "}
										{helpers.minutesToDuration(
											this.state.game.Properties
												.PhaseLengthMinutes
										)}
									</MaterialUI.Typography>
									<div> {this.getIcons()}</div>
								</div>
							</React.Fragment>
						);
					}
				})()}

				<div></div>
			</div>
		);

		let gameView = (
			<MaterialUI.Zoom
				in={this.state.viewOpen}
				mountOnEnter
				unmountOnExit
			>
				<div
					style={{
						position: "fixed",
						zIndex: 1300,
						right: 0,
						bottom: 0,
						top: 0,
						left: 0,
						background: "#ffffff"
					}}
				>
					<Game
						unreadMessagesUpdate={this.reloadGame}
						gamePromise={
							new Promise((res, rej) => {
								res(this.state.game);
							})
						}
						close={this.closeGame}
					/>
				</div>
			</MaterialUI.Zoom>
		);

		if (this.props.summaryOnly) {
			return (
				<React.Fragment>
					<div style={{ width: "100%" }} onClick={this.viewGame}>
						{summary}
					</div>
					{gameView}
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<MaterialUI.ExpansionPanel key="game-details">
					{/* TODO: @Joren, the next iteration is here: styling the the expansionpanel on "My ..." list */}
					<MaterialUI.ExpansionPanelSummary
						classes={{
							content: helpers.scopedClass("min-width: 0;")
						}}
						expandIcon={helpers.createIcon("\ue5cf")}
					>
						{summary}
					</MaterialUI.ExpansionPanelSummary>
					<MaterialUI.ExpansionPanelDetails style={{}}>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								flexWrap: "wrap",
								maxWidth: "960px",
								width: "100%"
							}}
						>
							<div
								style={{
									maxWidth: "460px"
								}}
							>
								{expandedGameItems}
							</div>
							<div
								style={{
									width: "100%",
									maxWidth: "460px"
								}}
							>
								{playerList}
							</div>
						</div>
					</MaterialUI.ExpansionPanelDetails>
				</MaterialUI.ExpansionPanel>
				{gameView}
				<NationPreferencesDialog
					parentCB={c => {
						this.nationPreferencesDialog = c;
					}}
					onSelected={null}
				/>
			</React.Fragment>
		);
	}
}
