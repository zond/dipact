import * as helpers from '%{ cb "./helpers.js" }%';

import Game from '%{ cb "./game.js" }%';

export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = { viewOpen: false };
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == this.props.user.Email;
		});
		this.viewGame = this.viewGame.bind(this);
		this.closeGame = this.closeGame.bind(this);
	}
	closeGame() {
		this.setState({ viewOpen: false });
	}
	viewGame() {
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
		let icons = [];
		if (
			this.member != null &&
			this.props.game.Properties.Started &&
			!this.props.game.Properties.Finished
		) {
			if (this.member.NewestPhaseState.OnProbation) {
				this.addIcon(icons, "\ue88b", "red");
			} else if (this.member.NewestPhaseState.ReadyToResolve) {
				this.addIcon(icons, "\ue877", "green");
			}
		}
		if (
			this.props.game.Properties.MinQuickness ||
			this.props.game.Properties.MinReliability
		) {
			this.addIcon(icons, "\ue425", "black");
		}
		if (
			this.props.game.Properties.MinRating ||
			this.props.game.Properties.MaxRating
		) {
			this.addIcon(icons, "\ue83a", "black");
		}
		if (
			this.props.game.Properties.MaxHater ||
			this.props.game.Properties.MaxHated
		) {
			this.addIcon(icons, "\ue612", "black");
		}
		if (
			this.props.game.Properties.DisableConferenceChat ||
			this.props.game.Properties.DisableGroupChat ||
			this.props.game.Properties.DisablePrivateChat
		) {
			this.addIcon(icons, "\ue61e", "black");
		}
		if (this.props.game.Properties.Private) {
			this.addIcon(icons, "\ue628", "black");
		}
		if (this.props.game.Properties.NationAllocation == 1) {
			this.addIcon(icons, "\ue065", "black");
		}

		return <MaterialUI.Box display="inline">{icons}</MaterialUI.Box>;
	}
	getVariant(name) {
		let v = this.props.variants.find(v => {
			return v.Name == name;
		});
		if (v) {
			return v;
		}
		return { Properties: { Nations: [] } };
	}
	render() {
		let expandedGameCells = [
			"Created at",
			helpers.timeStrToDate(this.props.game.Properties.CreatedAt)
		];
		if (this.props.game.Properties.Started) {
			expandedGameCells.push(
				"Started at",
				helpers.timeStrToDate(this.props.game.Properties.StartedAt)
			);
		}
		if (this.props.game.Properties.Finished) {
			expandedGameCells.push(
				"Finished at",
				helpers.timeStrToDate(this.props.game.Properties.FinishedAt)
			);
		}
		expandedGameCells.push(
			"Nation allocation",
			this.props.game.Properties.NationAllocation == 1
				? "Preferences"
				: "Random"
		);

		if (this.props.game.Properties.MinRating) {
			expandedGameCells.push(
				"Minimum rating",
				this.props.game.Properties.MinRating
			);
		}
		if (this.props.game.Properties.MaxRating) {
			expandedGameCells.push(
				"Maximum rating",
				this.props.game.Properties.MaxRating
			);
		}
		if (this.props.game.Properties.MinReliability) {
			expandedGameCells.push(
				"Minimum reliability",
				this.props.game.Properties.MinReliability
			);
		}
		if (this.props.game.Properties.MinQuickness) {
			expandedGameCells.push(
				"Minimum quickness",
				this.props.game.Properties.MinQuickness
			);
		}
		if (this.props.game.Properties.MaxHated) {
			expandedGameCells.push(
				"Maximum hated",
				this.props.game.Properties.MaxHated
			);
		}
		if (this.props.game.Properties.MaxHater) {
			expandedGameCells.push(
				"Maximum hater",
				this.props.game.Properties.MaxHater
			);
		}
		if (
			this.props.game.Properties.DisableConferenceChat ||
			this.props.game.Properties.DisableGroupChat ||
			this.props.game.Properties.DisablePrivateChat
		) {
			if (
				this.props.game.Properties.DisableConferenceChat &&
				this.props.game.Properties.DisableGroupChat &&
				this.props.game.Properties.DisablePrivateChat
			) {
				// Add two columns because this is required for formatting nicely.
				expandedGameCells.push("All chat disabled", "(Gunboat)");
			} else {
				// Sort channel types by whether they're enabled or disabled.
				let allChannels = { false: [], true: [] };
				allChannels[
					this.props.game.Properties.DisableConferenceChat
				].push("Conference");
				allChannels[this.props.game.Properties.DisableGroupChat].push(
					"Group"
				);
				allChannels[this.props.game.Properties.DisablePrivateChat].push(
					"Private"
				);
				expandedGameCells.push(
					"Disabled channels",
					allChannels[false].join(",")
				);
				expandedGameCells.push(
					"Enabled channels",
					allChannels[true].join(",")
				);
			}
		}
		let expandedGameItems = [];
		let itemKey = 0;
		expandedGameCells.forEach(cell =>
			expandedGameItems.push(
				<MaterialUI.Grid item key={itemKey++} xs={6}>
					<MaterialUI.Typography>{cell}</MaterialUI.Typography>
				</MaterialUI.Grid>
			)
		);
		this.props.game.Properties.Members.forEach(member => {
			expandedGameItems.push(
				<MaterialUI.Grid item key={itemKey++} xs={1}>
					<img src={member.User.Picture} className="profile-pic" />
				</MaterialUI.Grid>
			);
			expandedGameItems.push(
				<MaterialUI.Grid item key={itemKey++} xs={11}>
					<MaterialUI.Typography>
						{member.User.GivenName} {member.User.FamilyName}
					</MaterialUI.Typography>
				</MaterialUI.Grid>
			);
		});
		let buttons = [
			<MaterialUI.Button onClick={this.viewGame} key={itemKey++}>
				View
			</MaterialUI.Button>
		];
		this.props.game.Links.forEach(link => {
			if (link.Rel == "join") {
				buttons.push(
					<MaterialUI.Button key={itemKey++}>Join</MaterialUI.Button>
				);
			} else if (link.Rel == "leave") {
				buttons.push(
					<MaterialUI.Button key={itemKey++}>Leave</MaterialUI.Button>
				);
			}
		});
		expandedGameItems.push(
			<MaterialUI.Grid item key={itemKey++} xs={12}>
				<MaterialUI.ButtonGroup style={{ marginTop: "0.2em" }}>
					{buttons}
				</MaterialUI.ButtonGroup>
			</MaterialUI.Grid>
		);

		return [
			<MaterialUI.ExpansionPanel key="game-details">
				<MaterialUI.ExpansionPanelSummary
					className="game-summary"
					expandIcon={<i className="material-icons">&#xE5Cf;</i>}
				>
					<MaterialUI.Grid container>
						{(_ => {
							if (this.props.game.Properties.Started) {
								return [
									<MaterialUI.Grid
										key={itemKey++}
										item
										xs={12}
									>
										<MaterialUI.Typography
											textroverflow="ellipsis"
											noWrap={true}
										>
											{this.props.game.Name}
										</MaterialUI.Typography>
									</MaterialUI.Grid>,
									<MaterialUI.Grid
										key={itemKey++}
										item
										xs={12}
									>
										<MaterialUI.Typography>
											{
												this.props.game.Properties
													.NewestPhaseMeta[0].Season
											}{" "}
											{
												this.props.game.Properties
													.NewestPhaseMeta[0].Year
											}
											,{" "}
											{
												this.props.game.Properties
													.NewestPhaseMeta[0].Type
											}
										</MaterialUI.Typography>
									</MaterialUI.Grid>
								];
							} else {
								return [
									<MaterialUI.Grid
										key={itemKey++}
										item
										xs={11}
									>
										<MaterialUI.Typography
											textroverflow="ellipsis"
											noWrap={true}
										>
											{this.props.game.Name}
										</MaterialUI.Typography>
									</MaterialUI.Grid>,
									<MaterialUI.Grid
										key={itemKey++}
										item
										xs={1}
									>
										<MaterialUI.Typography>
											{
												this.props.game.Properties
													.NMembers
											}
											/
											{
												this.getVariant(
													this.props.game.Properties
														.Variant
												).Properties.Nations.length
											}{" "}
										</MaterialUI.Typography>
									</MaterialUI.Grid>
								];
							}
						})()}
						<MaterialUI.Grid item xs={12}>
							<MaterialUI.Typography
								textroverflow="ellipsis"
								noWrap={true}
								display="inline"
							>
								{this.props.game.Properties.Variant}{" "}
								{helpers.minutesToDuration(
									this.props.game.Properties
										.PhaseLengthMinutes
								)}
							</MaterialUI.Typography>
							{this.getIcons()}
						</MaterialUI.Grid>
					</MaterialUI.Grid>
				</MaterialUI.ExpansionPanelSummary>
				<MaterialUI.ExpansionPanelDetails
					style={{ paddingRight: "0.3em", paddingLeft: "0.3em" }}
				>
					<MaterialUI.Paper elevation={3}>
						<MaterialUI.Grid container style={{ margin: "0.3em" }}>
							{expandedGameItems}
						</MaterialUI.Grid>
					</MaterialUI.Paper>
				</MaterialUI.ExpansionPanelDetails>
			</MaterialUI.ExpansionPanel>,
			<MaterialUI.Dialog
				key="game-view"
				fullScreen
				open={this.state.viewOpen}
				TransitionComponent={helpers.Transition}
			>
				{this.state.viewOpen ? (
					<Game
						user={this.props.user}
						game={this.props.game}
						close={this.closeGame}
					/>
				) : (
					""
				)}
			</MaterialUI.Dialog>
		];
	}
}
