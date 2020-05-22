import * as helpers from '%{ cb "/js/helpers.js" }%';

import NationPreferencesDialog from '%{ cb "/js/nation_preferences_dialog.js" }%';

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
				Desc: Globals.user.GivenName + "'s game",
				Private: false,
				Anonymous: false,
				LastYear: 0,
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
			phaseLengthMultiplier: 1
		};
		this.close = this.close.bind(this);
		this.createGame = this.createGame.bind(this);
		this.createGameWithPreferences = this.createGameWithPreferences.bind(
			this
		);
		this.setPhaseLength = this.setPhaseLength.bind(this);
		this.setNonMovementPhaseLength = this.setNonMovementPhaseLength.bind(
			this
		);
		this.newGamePropertyUpdater = this.newGamePropertyUpdater.bind(this);
		this.checkboxField = this.checkboxField.bind(this);
		this.floatField = this.floatField.bind(this);
		this.validators = [];
		this.resetValidators = this.resetValidators.bind(this);
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.nationPreferencesDialog = null;
	}
	resetValidators() {
		this.validators = [
			props => {
				if (
					props.LastYear != 0 &&
					props.LastYear <
						this.state.variant.Properties.Start.Year + 1
				) {
					return (
						"Last year must be 0, or greater than or equal to " +
						(this.state.variant.Properties.Start.Year + 1) +
						"."
					);
				}
				return null;
			}
		];
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
		let invalids = [];
		this.validators.forEach(validator => {
			let validation = validator(this.state.newGameProperties);
			if (validation) {
				invalids.push(validation);
			}
		});
		if (invalids.length > 0) {
			helpers.snackbar(invalids.join("<br/>"));
			return;
		}
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
						state.newGameProperties["MinReliability"] = ev.target
							.checked
							? 0
							: Math.min(
									10,
									Math.floor(
										this.state.userStats.Properties
											.Reliability
									)
							  );
					}
					state.newGameProperties[propertyName] = opts.invert
						? !ev.target.checked
						: ev.target.checked;
				} else {
					let newValue = ev.target.value;
					if (opts.float && newValue != "") {
						newValue = Number.parseFloat(ev.target.value);
						if (opts.max && opts.max < newValue) {
							helpers.snackbar(
								propertyName +
									" must be lower than or equal to " +
									opts.max +
									"."
							);
							newValue = opts.max;
						}
						{
							/* TODO: removed this due to in-field validation. Not sure if I can remove */
						}
						if (opts.min && newValue != 0 && opts.min > newValue) {
							helpers.snackbar(
								propertyName +
									" must be 0, or greater than or equal to " +
									opts.min +
									"."
							);
						}
					}
					if (opts.int && newValue != "") {
						newValue = Number.parseInt(ev.target.value);
						if (opts.min && newValue != 0 && opts.min > newValue) {
							helpers.snackbar(
								propertyName +
									" must be 0, or greater than or equal to " +
									opts.min +
									"."
							);
						}
					}
					{
						/* TODO: unto here */
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
	floatField(name, opts = {}) {
		this.validators.push(properties => {
			if (properties[name] == "") {
				properties[name] = 0;
			}
			properties[name] = Number.parseFloat(properties[name]);
			if (properties[name] != 0) {
				if (opts.max && opts.max < properties[name]) {
					return (
						name +
						" must be lower than or equal to " +
						opts.max +
						"."
					);
				}
				if (opts.min && opts.min > properties[name]) {
					return (
						name +
						" must be 0, or greater than or equal to " +
						opts.min +
						"."
					);
				}
			}
			return null;
		});
		opts.float = true;
		return (
			<MaterialUI.TextField
				type="number"
				fullWidth
				label={opts.label || name}
				margin="dense"
				value={this.state.newGameProperties[name]}
				onChange={this.newGamePropertyUpdater(name, opts)}
			/>
		);
	}
	setNonMovementPhaseLength(ev) {
		ev.persist();
		this.setState((state, props) => {
			state = Object.assign({}, state);
			if (ev.target.name == "non-movement-phase-length-unit") {
				state.nonMovementPhaseLengthUnit = ev.target.value;
				state.newGameProperties["NonMovementPhaseLengthMinutes"] =
					state.nonMovementPhaseLengthUnit *
					state.nonMovementPhaseLengthMultiplier;
			} else if (
				ev.target.name == "non-movement-phase-length-multiplier"
			) {
				state.nonMovementPhaseLengthMultiplier = ev.target.value;
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
		this.setState((state, props) => {
			state = Object.assign({}, state);
			if (ev.target.name == "phase-length-unit") {
				state.phaseLengthUnit = ev.target.value;
			} else if (ev.target.name == "phase-length-multiplier") {
				state.phaseLengthMultiplier = ev.target.value;
			}
			state.newGameProperties["PhaseLengthMinutes"] =
				state.phaseLengthUnit * state.phaseLengthMultiplier;
			return state;
		});
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
		this.resetValidators();
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

					<div style={{ maxWidth: "920px", marginTop: "72px" }}>
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
								<MaterialUI.TextField
									key="Desc"
									label="Name"
									margin="dense"
									value={this.state.newGameProperties["Desc"]}
									onChange={this.newGamePropertyUpdater(
										"Desc"
									)}
									style={{ marginBottom: "8px" }}
								/>

								<MaterialUI.FormControlLabel
									control={
										<MaterialUI.Checkbox
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
									style={{ paddingBottom: "16px" }}
								>
									Start year:{" "}
									{this.state.variant.Properties.Start.Year}
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
										"NationAllocation"
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
												{/* TODO: this works only once. Why doesn't it work when I update a 2 back to 1? */}
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
									key="endEarly"
									control={
										<MaterialUI.Checkbox
											name="end-game-early"
											checked={true}
										/>
									}
									label="End in draw after number of years"
								/>
								{/*TODO: make the above  hide the part below, but needs to be defined in newGamePropertyUpdater which I don't understand*/}

								{/* TODO: this should calculate the default value of "lastyear" of startyear + 10, IF selected */}
								<MaterialUI.Box
									display="flex"
									key="NonMovementPhaseLengthMinutes"
									style={{ paddingLeft: "32px" }}
								>
									<MaterialUI.TextField
										type="number"
										style={{ minWidth: "240px" }}
										error={
											this.state.newGameProperties
												.LastYear <
											this.state.variant.Properties.Start
												.Year +
												1
												? true
												: false
										}
										helperText={
											this.state.newGameProperties
												.LastYear <
											this.state.variant.Properties.Start
												.Year +
												1
												? "Must be after the start year"
												: ""
										}
										label={
											"End after year (game starts " +
											this.state.variant.Properties.Start
												.Year +
											")"
										}
										value={
											this.state.newGameProperties
												.LastYear
										}
										onChange={this.newGamePropertyUpdater(
											"LastYear",
											{
												int: true,
												min:
													this.state.variant
														.Properties.Start.Year +
													1
											}
										)}
									/>
								</MaterialUI.Box>
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
								{/* TODO: instead of using the floatfield, I created a new one because it has more control. 
                However, each of them needs to : 
                - When the checkbox is not checked, set value to 0 (and hide the textfield)
                - When the checkbox is checkex, set value to the textfield (and show it)

                TODO: have an onclick on the whole flex div that toggles the checkbox, not just the checkbox.

                TODO: have this one selected by default and the input be their current level

                TODO: if private, have this one de-selected by default */}
								<div
									style={{
										display: "flex",
										marginLeft: "-10px",
										marginBottom: "12px"
									}}
								>
									<MaterialUI.Checkbox />
									<div
										style={{
											display: "flex",
											flexDirection: "column"
										}}
									>
										<MaterialUI.Typography variant="body1">
											Reliability (important)
										</MaterialUI.Typography>
										<MaterialUI.Typography
											variant="caption"
											style={{
												color: "rgba(40,26,26,0.56)"
											}}
										>
											Filter players that keep playing
										</MaterialUI.Typography>
									</div>
								</div>
								{/* TODO: the user input can be 0, but that would be the same as having the checkbox not checked */}
								{/* TODO: I added helpers.twoDecimals to make the scores seem normal in human eyes. However, there is a risk that a score of 4.457 will round to 4.46, and when the player enters 4.46 it will say "it's too high". Do we need to mitigate this (e.g. make the check with twodecimals on both scores, then use the lowest one in the real value set?*/}
								<MaterialUI.TextField
									type="number"
									label="Minimum reliability score"
									value={
										this.state.newGameProperties[
											"MinReliability"
										]
									}
									onChange={this.newGamePropertyUpdater(
										"MinReliability"
									)}
									error={
										this.state.userStats.Properties
											.Reliability <
										this.state.newGameProperties[
											"MinReliability"
										]
											? true
											: false
									}
									helperText={
										this.state.userStats.Properties
											.Reliability <
										this.state.newGameProperties[
											"MinReliability"
										]
											? "Can't be higher than your own reliability (" +
											  helpers.twoDecimals(
													this.state.userStats
														.Properties.Reliability
											  ) +
											  ")"
											: ""
									}
									style={{
										marginLeft: "32px",
										width: "calc(100% - 65px)",
										marginBottom: "16px"
									}}
								/>

								{/* TODO: similar as above */}

								<div
									style={{
										display: "flex",
										marginLeft: "-10px",
										marginBottom: "12px"
									}}
								>
									<MaterialUI.Checkbox />
									<div
										style={{
											display: "flex",
											flexDirection: "column"
										}}
									>
										<MaterialUI.Typography variant="body1">
											Quickness
										</MaterialUI.Typography>
										<MaterialUI.Typography
											variant="caption"
											style={{
												color: "rgba(40,26,26,0.56)"
											}}
										>
											Filter players that confirm their
											orders fast
										</MaterialUI.Typography>
									</div>
								</div>
								{/* TODO: appear below when checkbox is checked. {checked ? : }

                <MaterialUI.TextField type="number"
                  label="Minimum quickness score"
                  value={this.state.newGameProperties["MinQuickness"]}
      			  onChange={this.newGamePropertyUpdater("MinQuickness")}
      			  error={this.state.userStats.Properties.Quickness < this.state.newGameProperties["MinQuickness"] ? true : false }
      			  helperText={this.state.userStats.Properties.Quickness < this.state.newGameProperties["MinQuickness"] ? "Can't be higher than your own quickness (" + helpers.twoDecimals(this.state.userStats.Properties.Quickness) + ")" : "" }
      			  style={{marginLeft: "32px", width: "calc(100% - 65px)", marginBottom: "16px"}}
				

      				/> 
      			*/}

								<div
									style={{
										display: "flex",
										marginLeft: "-10px",
										marginBottom: "12px"
									}}
								>
									<MaterialUI.Checkbox />
									<div
										style={{
											display: "flex",
											flexDirection: "column"
										}}
									>
										<MaterialUI.Typography variant="body1">
											Minimum rating
										</MaterialUI.Typography>
										<MaterialUI.Typography
											variant="caption"
											style={{
												color: "rgba(40,26,26,0.56)"
											}}
										>
											Filter players who are challenging
										</MaterialUI.Typography>
									</div>
								</div>

								{/* TODO: appear when checkbox is checked. {checked ? : }

                <MaterialUI.TextField type="number"
                  label="Minimum rating"
                  value={this.state.newGameProperties["MinRating"]}
      			  onChange={this.newGamePropertyUpdater("MinRating")}
      			  error={this.state.userStats.Properties.TrueSkill.Rating < this.state.newGameProperties["MinRating"] ? true : false }
      			  helperText={this.state.userStats.Properties.TrueSkill.Rating < this.state.newGameProperties["MinRating"] ? "Can't be lower than your own quickness (" + helpers.twoDecimals(this.state.userStats.Properties.TrueSkill.Rating) + ")" : "" }
      			  style={{marginLeft: "32px", width: "calc(100% - 65px)", marginBottom: "16px"}}
      				/> 
      			*/}

								<div
									style={{
										display: "flex",
										marginLeft: "-10px",
										marginBottom: "12px"
									}}
								>
									<MaterialUI.Checkbox />
									<div
										style={{
											display: "flex",
											flexDirection: "column"
										}}
									>
										<MaterialUI.Typography variant="body1">
											Maximum rating
										</MaterialUI.Typography>
										<MaterialUI.Typography
											variant="caption"
											style={{
												color: "rgba(40,26,26,0.56)"
											}}
										>
											Filter players that are not too good
										</MaterialUI.Typography>
									</div>
								</div>

								{/* TODO: appear when checkbox is checked. {checked ? : }

                <MaterialUI.TextField type="number"
                  label="Maximum rating"
                  value={this.state.newGameProperties["MaxRating"]}
      			  onChange={this.newGamePropertyUpdater("MaxRating")}
      			  error={this.state.userStats.Properties.TrueSkill.Rating > this.state.newGameProperties["MaxRating"] ? true : false }
      			  helperText={this.state.userStats.Properties.TrueSkill.Rating > this.state.newGameProperties["MaxRating"] ? "Can't be higher than your own rating (" + helpers.twoDecimals(this.state.userStats.Properties.TrueSkill.Rating) + ")" : "" }
      			  style={{marginLeft: "32px", width: "calc(100% - 65px)", marginBottom: "16px"}}
      				/> 
      			*/}

								<div
									style={{
										display: "flex",
										marginLeft: "-10px",
										marginBottom: "12px"
									}}
								>
									<MaterialUI.Checkbox />
									<div
										style={{
											display: "flex",
											flexDirection: "column"
										}}
									>
										<MaterialUI.Typography variant="body1">
											Hated
										</MaterialUI.Typography>
										<MaterialUI.Typography
											variant="caption"
											style={{
												color: "rgba(40,26,26,0.56)"
											}}
										>
											Filter players that are not banned
											by others
										</MaterialUI.Typography>
									</div>
								</div>

								{/* TODO: appear when checkbox is checked. {checked ? : }

                <MaterialUI.TextField type="number"
                  label="Maximum hated"
                  value={this.state.newGameProperties["MaxHated"]}
      			  onChange={this.newGamePropertyUpdater("MaxHated")}
      			  error={this.state.userStats.Properties.Hated > this.state.newGameProperties["MaxHated"] ? true : false }
      			  helperText={this.state.userStats.Properties.Hated > this.state.newGameProperties["MaxHated"] ? "Can't be higher than your own hated score (" + helpers.twoDecimals(this.state.userStats.Properties.Hated) + ")" : "" }
      			  style={{marginLeft: "32px", width: "calc(100% - 65px)", marginBottom: "16px"}}
      				/> 
      			*/}

								<div
									style={{
										display: "flex",
										marginLeft: "-10px",
										marginBottom: "12px"
									}}
								>
									<MaterialUI.Checkbox />
									<div
										style={{
											display: "flex",
											flexDirection: "column"
										}}
									>
										<MaterialUI.Typography variant="body1">
											Haters
										</MaterialUI.Typography>
										<MaterialUI.Typography
											variant="caption"
											style={{
												color: "rgba(40,26,26,0.56)"
											}}
										>
											Filter patient players (don't ban
											others)
										</MaterialUI.Typography>
									</div>
								</div>

								{/* TODO: appear when checkbox is checked. {checked ? : }

                <MaterialUI.TextField type="number"
                  label="Maximum hate"
                  value={this.state.newGameProperties["MaxHater"]}
      			  onChange={this.newGamePropertyUpdater("MaxHater")}
      			  error={this.state.userStats.Properties.Hater > this.state.newGameProperties["MaxHater"] ? true : false }
      			  helperText={this.state.userStats.Properties.Hater > this.state.newGameProperties["MaxHater"] ? "Can't be higher than your own hater score (" + helpers.twoDecimals(this.state.userStats.Properties.Hater) + ")" : "" }
      			  style={{marginLeft: "32px", width: "calc(100% - 65px)", marginBottom: "16px"}}
      				/> 
      			*/}
							</div>
						</div>

						<MaterialUI.Button
							onClick={this.createGame}
							color="primary"
						>
							Create
						</MaterialUI.Button>
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
