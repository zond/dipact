import * as helpers from '%{ cb "/js/helpers.js" }%';

import NationPreferencesDialog from '%{ cb "/js/nation_preferences_dialog.js" }%';

const intReg = /^[0-9]+$/;
const floatReg = /^[0-9]+(\.[0-9]+)?$/;

export default class CreateGameDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			variant: Globals.variants.find(v => {
				return v.Properties.Name == "Classical";
			}),
			newGameProperties: {
				Variant: "Classical",
				NationAllocation: 0,
				PhaseLengthMinutes: 1440,
				NonMovementPhaseLengthMinutes: 0,
				Desc: helpers.randomGameName(),
				Private: false,
				Anonymous: false,
				LastYear: 0,
				// TODO(zond): Change this to false once the feature is better tested.
				SkipMuster: true,
				MinReliability: Math.min(
					10,
					Math.floor(Globals.userStats.Properties.Reliability)
				),
				MinQuickness: 0,
				MinRating: 0,
				MaxRating: 0,
				MaxHated: 0,
				MaxHater: 0,
				DisableConferenceChat: false,
				DisableGroupChat: false,
				DisablePrivateChat: false
			},
			userStats: Globals.userStats,
			samePhaseLength: true,
			nonMovementPhaseLengthUnit: 60 * 24,
			nonMovementPhaseLengthMultiplier: 1,
			phaseLengthUnit: 60 * 24,
			phaseLengthMultiplier: 1,
			checkboxedFloatFields: { MinReliability: true },
			endEarly: false
		};
		this.close = this.close.bind(this);
		this.createGame = this.createGame.bind(this);
		this.createGameWithPreferences = this.createGameWithPreferences.bind(
			this
		);
		this.setPhaseLength = this.setPhaseLength.bind(this);
		this.limitedCheckboxedFloatField = this.limitedCheckboxedFloatField.bind(
			this
		);
		this.setNonMovementPhaseLength = this.setNonMovementPhaseLength.bind(
			this
		);
		this.newGamePropertyUpdater = this.newGamePropertyUpdater.bind(this);
		this.checkboxField = this.checkboxField.bind(this);
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.nationPreferencesDialog = null;
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			JSON.stringify(Globals.userStats) !=
			JSON.stringify(this.state.userStats)
		) {
			this.setState((state, props) => {
				state = Object.assign({}, state);
				state.userStats = Globals.userStats;
				state.newGameProperties.MinReliability = Math.min(
					10,
					Math.floor(Globals.userStats.Properties.Reliability)
				);
				return state;
			});
		}
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "CreateGameDialog",
				page_location: location.href
			});
			gtag("event", "page_view");
		}
	}
	close() {
		return new Promise((res, rej) => {
			helpers.unback(this.close);
			this.setState({ open: false }, res);
		});
	}
	createGame() {
		const errs = [];
		if (
			this.state.newGameProperties.MinReliability != 0 &&
			this.state.newGameProperties.MinReliability >
				this.state.userStats.Properties.Reliability
		) {
			errs.push(
				"You can't create a game with higher minimum reliability than your own (" +
					helpers.twoDecimals(
						this.state.userStats.Properties.Reliability
					) +
					")!"
			);
		}
		if (
			this.state.newGameProperties.MinQuickness != 0 &&
			this.state.newGameProperties.MinQuickness >
				this.state.userStats.Properties.Quickness
		) {
			errs.push(
				"You can't create a game with higher minimum quickness than your own (" +
					helpers.twoDecimals(
						this.state.userStats.Properties.Quickness
					) +
					")!"
			);
		}
		if (
			this.state.newGameProperties.MinRating != 0 &&
			this.state.newGameProperties.MinRating >
				this.state.userStats.Properties.TrueSkill.Rating
		) {
			errs.push(
				"You can't create a game with higher minimum rating than your own (" +
					helpers.twoDecimals(
						this.state.userStats.Properties.TrueSkill.Rating
					) +
					")!"
			);
		}
		if (
			this.state.newGameProperties.MaxRating != 0 &&
			this.state.newGameProperties.MaxRating <
				this.state.userStats.Properties.TrueSkill.Rating
		) {
			errs.push(
				"You can't create a game with lower maximum rating than your own (" +
					helpers.twoDecimals(
						this.state.userStats.Properties.TrueSkill.Rating
					) +
					")!"
			);
		}
		if (errs.length > 0) {
			helpers.snackbar(
				errs.map(err => {
					return <p key={err}>{err}</p>;
				})
			);
			return;
		}
		if (this.state.newGameProperties.NationAllocation == 1) {
			this.nationPreferencesDialog.setState({
				open: true,
				nations: this.state.variant.Properties.Nations,
				onSelected: preferences => {
					this.createGameWithPreferences(preferences);
				}
			});
		} else {
			this.createGameWithPreferences([]);
		}
	}
	createGameWithPreferences(preferences) {
		const newGameProps = Object.assign({}, this.state.newGameProperties);
		newGameProps.FirstMember = {
			NationPreferences: preferences.join(",")
		};
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest("/Game", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(newGameProps)
				})
			)
			.then(resp => {
				helpers.decProgress();
				gtag("event", "create_game");
				Globals.messaging.start();
				this.close().then(this.props.gameCreated);
			});
	}
	newGamePropertyUpdater(propertyName, opts = {}) {
		return ev => {
			ev.persist();
			this.setState((state, props) => {
				state = Object.assign({}, state);
				if (ev.target.type == "checkbox") {
					if (propertyName == "Private") {
						if (ev.target.checked) {
							state.newGameProperties["MinReliability"] = 0;
							state.checkboxedFloatFields[
								"MinReliability"
							] = true;
						} else {
							state.newGameProperties[
								"MinReliability"
							] = Math.min(
								10,
								Math.floor(
									this.state.userStats.Properties.Reliability
								)
							);
							delete state.checkboxedFloatFields[
								"MinReliability"
							];
						}
					}
					state.newGameProperties[propertyName] = opts.invert
						? !ev.target.checked
						: ev.target.checked;
				} else {
					let newValue = ev.target.value;
					if (opts.float && floatReg.exec(newValue)) {
						newValue = Number.parseFloat(ev.target.value);
					}
					if (opts.int && intReg.exec(newValue)) {
						newValue = Number.parseInt(ev.target.value);
					}
					state.newGameProperties[propertyName] = newValue;
				}
				state.variant = Globals.variants.find(v => {
					return v.Properties.Name == state.newGameProperties.Variant;
				});
				return state;
			});
		};
	}
	setNonMovementPhaseLength(ev) {
		ev.persist();
		const val = intReg.exec(ev.target.value)
			? Number.parseInt(ev.target.value)
			: ev.target.value;
		this.setState((state, props) => {
			state = Object.assign({}, state);
			if (ev.target.name == "non-movement-phase-length-unit") {
				state.nonMovementPhaseLengthUnit = val;
				state.newGameProperties["NonMovementPhaseLengthMinutes"] =
					state.nonMovementPhaseLengthUnit *
					state.nonMovementPhaseLengthMultiplier;
			} else if (
				ev.target.name == "non-movement-phase-length-multiplier"
			) {
				state.nonMovementPhaseLengthMultiplier = val;
				state.newGameProperties["NonMovementPhaseLengthMinutes"] =
					state.nonMovementPhaseLengthUnit *
					state.nonMovementPhaseLengthMultiplier;
			} else if (ev.target.name == "same-phase-length") {
				if (ev.target.checked) {
					state.newGameProperties[
						"NonMovementPhaseLengthMinutes"
					] = 0;
					state.samePhaseLength = false;
				} else {
					state.newGameProperties["NonMovementPhaseLengthMinutes"] =
						state.nonMovementPhaseLengthUnit *
						state.nonMovementPhaseLengthMultiplier;
					state.samePhaseLength = true;
				}
			}
			return state;
		});
	}
	setPhaseLength(ev) {
		ev.persist();
		const val = intReg.exec(ev.target.value)
			? Number.parseInt(ev.target.value)
			: ev.target.value;
		this.setState((state, props) => {
			state = Object.assign({}, state);
			if (ev.target.name == "phase-length-unit") {
				state.phaseLengthUnit = val;
			} else if (ev.target.name == "phase-length-multiplier") {
				state.phaseLengthMultiplier = val;
			}
			state.newGameProperties["PhaseLengthMinutes"] =
				state.phaseLengthUnit * state.phaseLengthMultiplier;
			return state;
		});
	}
	/**
	 {
	   defaultValue: helpers.twoDecimals(this.state.userStats.Properties.Reliability),
	   checkbox: {
	     label: "Reliability (important)",
		 caption: "Filter players that keep playing"
	   },
       textfield: {
	     label: "Minimum reliability score"
	   },
	   helperText: null,
	   max: {
	     value: this.state.userStats.Properties.Reliability,
		 helperText: "Can't be higher than your own reliability (" +
											  helpers.twoDecimals(
													this.state.userStats
														.Properties.Reliability
											  ) + ")"
	   },
	   min: null
	 }
	 */
	limitedCheckboxedFloatField(name, opts = {}) {
		const maxError =
			opts.max && opts.max.value < this.state.newGameProperties[name];
		const minError =
			opts.min && opts.min.value > this.state.newGameProperties[name];
		return (
			<React.Fragment>
				<div
					style={{
						display: "flex",
						marginLeft: "-10px",
						marginBottom: "12px"
					}}
				>
					<MaterialUI.Checkbox
						checked={!!this.state.checkboxedFloatFields[name]}
						onChange={ev => {
							const checked = ev.target.checked;
							this.setState((state, props) => {
								state = Object.assign({}, state);
								state.checkboxedFloatFields[name] = checked;
								state.newGameProperties[name] = checked
									? opts.defaultValue
									: 0;
								return state;
							});
						}}
					/>
					<div
						style={{
							display: "flex",
							flexDirection: "column"
						}}
					>
						<MaterialUI.Typography variant="body1">
							{opts.checkbox.label}
						</MaterialUI.Typography>
						<MaterialUI.Typography
							variant="caption"
							style={{
								color: "rgba(40,26,26,0.56)"
							}}
						>
							{opts.checkbox.caption}
						</MaterialUI.Typography>
					</div>
				</div>
				{this.state.checkboxedFloatFields[name] ? (
					<MaterialUI.TextField
						type="number"
						label={opts.textfield.label}
						value={this.state.newGameProperties[name]}
						onChange={this.newGamePropertyUpdater(name, {
							float: true
						})}
						error={maxError || minError}
						helperText={
							maxError
								? opts.max.helperText
								: minError
								? opts.min.helperText
								: opts.helperText || ""
						}
						style={{
							marginLeft: "32px",
							width: "calc(100% - 65px)",
							marginBottom: "16px"
						}}
					/>
				) : (
					""
				)}
			</React.Fragment>
		);
	}
	checkboxField(name, opts = {}) {
		return (
			<MaterialUI.FormControlLabel
				control={
					<MaterialUI.Checkbox
						checked={
							opts.invert
								? !this.state.newGameProperties[name]
								: this.state.newGameProperties[name]
						}
						onChange={this.newGamePropertyUpdater(name, opts)}
					/>
				}
				label={opts.label || name}
			/>
		);
	}

	render() {
		return (
			<React.Fragment>
				<MaterialUI.Dialog
					onEntered={helpers.genOnback(this.close)}
					open={this.state.open}
					disableBackdropClick={false}
					onClose={this.close}
					fullScreen
				>
					<MaterialUI.AppBar>
						<MaterialUI.Toolbar>
							<MaterialUI.IconButton
								edge="start"
								color="inherit"
								onClick={this.close}
								aria-label="close"
							>
								{helpers.createIcon("\ue5cd")}
							</MaterialUI.IconButton>
							<MaterialUI.Typography
								variant="h6"
								style={{ paddingLeft: "16px" }}
							>
								Create new game
							</MaterialUI.Typography>
						</MaterialUI.Toolbar>
					</MaterialUI.AppBar>

					<div
						style={{
							maxWidth: "920px",
							marginTop: "72px",
							marginLeft: "auto",
							marginRight: "auto"
						}}
					>
						<div
							style={{
								margin: "auto",
								width: "calc(100% - 32px)"
							}}
						>
							<div
								id="step1"
								style={{
									display: "flex",
									flexDirection: "column"
								}}
							>
								<div style={{ display: "flex" }}>
									<MaterialUI.TextField
										key="Desc"
										label="Name"
										margin="dense"
										value={
											this.state.newGameProperties["Desc"]
										}
										onChange={this.newGamePropertyUpdater(
											"Desc"
										)}
										style={{
											marginBottom: "8px",
											flexGrow: "1"
										}}
									/>
									<MaterialUI.IconButton
										onClick={_ => {
											this.setState((state, props) => {
												state = Object.assign(
													{},
													state
												);
												state.newGameProperties.Desc = helpers.randomGameName();
												return state;
											});
										}}
									>
										{helpers.createIcon("\ue86a")}
									</MaterialUI.IconButton>
								</div>

								<MaterialUI.FormControlLabel
									control={
										<MaterialUI.Checkbox
											checked={
												this.state.newGameProperties[
													"Private"
												]
											}
											onChange={this.newGamePropertyUpdater(
												"Private"
											)}
										/>
									}
									label="Private game"
									style={{ marginBottom: "8px" }}
								/>

								<MaterialUI.InputLabel shrink id="variantlabel">
									Variant
								</MaterialUI.InputLabel>
								<MaterialUI.Select
									key="Variant"
									labelId="variantlabel"
									value={
										this.state.newGameProperties["Variant"]
									}
									onChange={this.newGamePropertyUpdater(
										"Variant"
									)}
									style={{ marginBottom: "16px" }}
								>
									{Globals.variants.map(variant => {
										return (
											<MaterialUI.MenuItem
												key={variant.Properties.Name}
												value={variant.Properties.Name}
											>
												{variant.Properties.Name} {" ("}
												{
													variant.Properties.Nations
														.length
												}{" "}
												players)
											</MaterialUI.MenuItem>
										);
									})}
								</MaterialUI.Select>

								<MaterialUI.Typography
									style={{ paddingBottom: "4px" }}
									variant="body2"
									fontStyle="italic"
								>
									<i>
										{
											this.state.variant.Properties
												.Description
										}
									</i>
								</MaterialUI.Typography>
								<img
									src={this.state.variant.Links[3].URL}
									style={{
										paddingBottom: "4px",
										maxHeight: "300px"
									}}
								/>
								<MaterialUI.Typography
									variant="body2"
									style={{ paddingBottom: "4px" }}
								>
									Start year:{" "}
									{this.state.variant.Properties.Start.Year}
								</MaterialUI.Typography>
								<MaterialUI.Typography
									variant="body2"
									style={{ paddingBottom: "16px" }}
								>
									Original author:{" "}
									{this.state.variant.Properties.CreatedBy}
								</MaterialUI.Typography>

								<MaterialUI.Typography
									variant="caption"
									style={{ color: "rgba(0,0,0,0.57)" }}
								>
									Variant Rules
								</MaterialUI.Typography>
								<MaterialUI.Typography
									style={{
										paddingBottom: "16px",
										overflowWrap: "break-word"
									}}
									variant="body1"
								>
									{this.state.variant.Properties.Rules}
								</MaterialUI.Typography>

								<MaterialUI.Typography
									variant="caption"
									style={{ color: "rgba(0,0,0,0.57)" }}
								>
									Nation selection
								</MaterialUI.Typography>

								<MaterialUI.RadioGroup
									key="NationAllocation"
									value={parseInt(
										this.state.newGameProperties[
											"NationAllocation"
										]
									)}
									onChange={this.newGamePropertyUpdater(
										"NationAllocation",
										{ int: true }
									)}
									style={{
										flexDirection: "row",
										flexWrap: "wrap",
										width: "calc(100% - 32px)"
									}}
								>
									<MaterialUI.FormControlLabel
										value={0}
										key={0}
										control={<MaterialUI.Radio />}
										label="Random"
									/>
									<MaterialUI.FormControlLabel
										value={1}
										key={1}
										control={<MaterialUI.Radio />}
										label="Preference based"
									/>
								</MaterialUI.RadioGroup>
							</div>
							<div>
								<MaterialUI.Typography
									variant="subtitle2"
									style={{
										marginTop: "16px",
										marginBottom: "16px"
									}}
								>
									Game length
								</MaterialUI.Typography>
							</div>

							<div
								id="step2"
								style={{
									display: "flex",
									flexDirection: "column"
								}}
							>
								<MaterialUI.Box
									display="flex"
									key="PhaseLengthMinutes"
								>
									<MaterialUI.TextField
										name="phase-length-multiplier"
										label="Phase length"
										type="number"
										inputProps={{ min: 1 }}
										value={this.state.phaseLengthMultiplier}
										onChange={this.setPhaseLength}
										style={{ minWidth: "170px" }}
									/>
									<MaterialUI.Select
										name="phase-length-unit"
										value={this.state.phaseLengthUnit}
										onChange={this.setPhaseLength}
									>
										<MaterialUI.MenuItem key={1} value={1}>
											{this.state
												.phaseLengthMultiplier === 1
												? "Minute"
												: "Minutes"}
										</MaterialUI.MenuItem>
										<MaterialUI.MenuItem
											key={60}
											value={60}
										>
											{this.state
												.phaseLengthMultiplier === 1
												? "Hour"
												: "Hours"}
										</MaterialUI.MenuItem>
										<MaterialUI.MenuItem
											key={60 * 24}
											value={60 * 24}
										>
											{this.state
												.phaseLengthMultiplier === 1
												? "Day"
												: "Days"}
										</MaterialUI.MenuItem>
									</MaterialUI.Select>
								</MaterialUI.Box>

								<MaterialUI.FormControlLabel
									key="samePhaseLength"
									control={
										<MaterialUI.Checkbox
											name="same-phase-length"
											checked={
												!this.state.samePhaseLength
											}
											onChange={
												this.setNonMovementPhaseLength
											}
										/>
									}
									label="Shorter adjustment phases"
								/>
								{this.state.samePhaseLength ? (
									""
								) : (
									<MaterialUI.Box
										display="flex"
										key="nonmovementPhaseLengthMinutes"
										style={{ paddingLeft: "32px" }}
									>
										<MaterialUI.TextField
											name="non-movement-phase-length-multiplier"
											label="Adjustment phase length"
											type="number"
											inputProps={{ min: 1 }}
											value={
												this.state
													.nonMovementPhaseLengthMultiplier
											}
											onChange={
												this.setNonMovementPhaseLength
											}
											style={{ minWidth: "170px" }}
										/>
										<MaterialUI.Select
											name="non-movement-phase-length-unit"
											value={
												this.state
													.nonMovementPhaseLengthUnit
											}
											onChange={
												this.setNonMovementPhaseLength
											}
										>
											<MaterialUI.MenuItem
												key={1}
												value={1}
											>
												{this.state
													.nonMovementPhaseLengthMultiplier ===
												1
													? "Minute"
													: "Minutes"}
											</MaterialUI.MenuItem>
											<MaterialUI.MenuItem
												key={60}
												value={60}
											>
												{this.state
													.nonMovementPhaseLengthMultiplier ===
												1
													? "Hour"
													: "Hours"}
											</MaterialUI.MenuItem>
											<MaterialUI.MenuItem
												key={60 * 24}
												value={60 * 24}
											>
												{this.state
													.nonMovementPhaseLengthMultiplier ===
												1
													? "Day"
													: "Days"}
											</MaterialUI.MenuItem>
										</MaterialUI.Select>
									</MaterialUI.Box>
								)}

								<MaterialUI.FormControlLabel
									control={
										<MaterialUI.Checkbox
											checked={
												this.state.newGameProperties[
													"SkipMuster"
												]
											}
											onChange={this.newGamePropertyUpdater(
												"SkipMuster"
											)}
										/>
									}
									label="Skip mustering phase"
									style={{ marginBottom: "8px" }}
								/>
								<MaterialUI.FormHelperText>
									The initial mustering phase ejects all
									non-ready players and and reverts the game
									to the staging state unless all players
									report ready within the deadline.
								</MaterialUI.FormHelperText>

								<MaterialUI.FormControlLabel
									key="endEarly"
									control={
										<MaterialUI.Checkbox
											name="end-game-early"
											onChange={ev => {
												ev.persist();
												this.setState(
													(state, props) => {
														state = Object.assign(
															{},
															state
														);
														state.endEarly =
															ev.target.checked;
														state.newGameProperties.LastYear = ev
															.target.checked
															? this.state.variant
																	.Properties
																	.Start
																	.Year + 7
															: 0;
														return state;
													}
												);
											}}
											checked={this.state.endEarly}
										/>
									}
									label="End in draw after number of years"
								/>
								{this.state.endEarly ? (
									<MaterialUI.Box
										display="flex"
										key="last-year"
										style={{ paddingLeft: "32px" }}
									>
										<MaterialUI.TextField
											type="number"
											style={{ minWidth: "240px" }}
											error={
												this.state.newGameProperties
													.LastYear <
												this.state.variant.Properties
													.Start.Year +
													1
													? true
													: false
											}
											helperText={
												this.state.newGameProperties
													.LastYear <
												this.state.variant.Properties
													.Start.Year +
													1
													? "Must be after the start year"
													: ""
											}
											label={
												"End after year (game starts " +
												this.state.variant.Properties
													.Start.Year +
												")"
											}
											value={
												this.state.newGameProperties
													.LastYear
											}
											onChange={this.newGamePropertyUpdater(
												"LastYear",
												{
													int: true
												}
											)}
										/>
									</MaterialUI.Box>
								) : (
									""
								)}
							</div>
							<div>
								<MaterialUI.Typography
									variant="subtitle2"
									style={{
										marginTop: "16px",
										marginBottom: "16px"
									}}
								>
									Chat
								</MaterialUI.Typography>
							</div>
							<div id="part3">
								<MaterialUI.Typography
									variant="caption"
									style={{ color: "rgba(0,0,0,0.57)" }}
								>
									Allow chats:
								</MaterialUI.Typography>
								<MaterialUI.FormGroup>
									{this.checkboxField(
										"DisableConferenceChat",
										{
											invert: true,
											label: "Conference (all players)"
										}
									)}
									{this.checkboxField("DisableGroupChat", {
										invert: true,
										label: "Group"
									})}
									{this.checkboxField("DisablePrivateChat", {
										invert: true,
										label: "Individual"
									})}
									<MaterialUI.FormControlLabel
										control={
											<MaterialUI.Checkbox
												disabled={
													!this.state
														.newGameProperties[
														"Private"
													]
												}
												checked={
													this.state
														.newGameProperties[
														"Private"
													]
														? this.state
																.newGameProperties[
																"Anonymous"
														  ]
														: this.state
																.newGameProperties[
																"DisableConferenceChat"
														  ] &&
														  this.state
																.newGameProperties[
																"DisableGroupChat"
														  ] &&
														  this.state
																.newGameProperties[
																"DisablePrivateChat"
														  ]
												}
												onChange={this.newGamePropertyUpdater(
													"Anonymous"
												)}
											/>
										}
										label="Anonymous"
									/>
								</MaterialUI.FormGroup>
								{this.state.newGameProperties["Private"] ? (
									""
								) : (
									<MaterialUI.FormHelperText>
										Anonymous only allowed in private games
										(risk of abuse)
									</MaterialUI.FormHelperText>
								)}
							</div>
							<div>
								<MaterialUI.Typography
									variant="subtitle2"
									style={{
										marginTop: "16px",
										marginBottom: "16px"
									}}
								>
									Player requirements
								</MaterialUI.Typography>
							</div>
							<div id="part4">
								{this.state.newGameProperties["Private"] ? (
									<MaterialUI.Typography
										variant="body1"
										style={{
											marginTop: "4px",
											marginBottom: "8px",
											color: "#f44336"
										}}
									>
										For private games we advise you to not
										add requirements, so your friends can
										all join your game.
									</MaterialUI.Typography>
								) : (
									""
								)}
								{this.limitedCheckboxedFloatField(
									"MinReliability",
									{
										defaultValue: Math.min(
											10,
											Math.floor(
												Globals.userStats.Properties
													.Reliability
											)
										),
										checkbox: {
											label: "Reliability (important)",
											caption:
												"Find players that keep playing"
										},
										textfield: {
											label: "Minimum reliability score"
										},
										max: {
											value: this.state.userStats
												.Properties.Reliability,
											helperText:
												"Can't be higher than your own reliability (" +
												helpers.twoDecimals(
													this.state.userStats
														.Properties.Reliability
												) +
												")"
										},
										min: null
									}
								)}
								{this.limitedCheckboxedFloatField(
									"MinQuickness",
									{
										defaultValue: Math.min(
											10,
											Math.floor(
												Globals.userStats.Properties
													.Quickness
											)
										),
										checkbox: {
											label: "Quickness",
											caption:
												"Find players that confirm their orders before deadline"
										},
										textfield: {
											label: "Minimum quickness score"
										},
										max: {
											value: this.state.userStats
												.Properties.Quickness,
											helperText:
												"Can't be higher than your own quickness (" +
												helpers.twoDecimals(
													this.state.userStats
														.Properties.Quickness
												) +
												")"
										},
										min: null
									}
								)}

								{this.limitedCheckboxedFloatField("MinRating", {
									defaultValue: 0,
									checkbox: {
										label: "Minimum rating",
										caption:
											"Find players that are challenging"
									},
									textfield: {
										label: "Minimum rating"
									},
									helperText:
										"Removes the least challenging " +
										(100 -
											helpers.ratingPercentile(
												this.state.newGameProperties
													.MinRating
											)) +
										"% of active players",
									max: {
										value: this.state.userStats.Properties
											.TrueSkill.Rating,
										helperText:
											"Can't be higher than your own rating (" +
											helpers.twoDecimals(
												this.state.userStats.Properties
													.TrueSkill.Rating
											) +
											")"
									},
									min: null
								})}

								{this.limitedCheckboxedFloatField("MaxRating", {
									defaultValue: helpers.twoDecimals(
										this.state.userStats.Properties
											.TrueSkill.Rating,
										true
									),
									checkbox: {
										label: "Maximum rating",
										caption:
											"Find players that aren't too challenging"
									},
									helperText:
										"Removes the most challenging " +
										helpers.ratingPercentile(
											this.state.newGameProperties
												.MaxRating
										) +
										"% of active players",
									textfield: {
										label: "Maximum rating"
									},
									min: {
										value: this.state.userStats.Properties
											.TrueSkill.Rating,
										helperText:
											"Can't be lower than your own rating (" +
											helpers.twoDecimals(
												this.state.userStats.Properties
													.TrueSkill.Rating,
												true
											) +
											")"
									},
									max: null
								})}
							</div>
						</div>
						<div style={{ padding: "16px", textAlign: "center" }}>
							<MaterialUI.Button
								variant="contained"
								onClick={this.createGame}
								color="primary"
							>
								Create
							</MaterialUI.Button>
						</div>
					</div>
				</MaterialUI.Dialog>
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
