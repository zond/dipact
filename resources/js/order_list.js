import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { phaseStates: {} };
		this.loadPhaseStates = this.loadPhaseStates.bind(this);
		this.toggleDIAS = this.toggleDIAS.bind(this);
		this.toggleReady = this.toggleReady.bind(this);
		this.toggleFunc = this.toggleFunc.bind(this);
	}
	toggleFunc(nation, updater) {
		return _ => {
			let phaseState = this.state.phaseStates[nation];
			updater(phaseState);
			let updateLink = phaseState.Links.find(l => {
				return l.Rel == "update";
			});
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(updateLink.URL, {
						headers: {
							"Content-Type": "application/json"
						},
						method: updateLink.Method,
						body: JSON.stringify(phaseState.Properties)
					})
				)
				.then(res => res.json())
				.then(js => {
					helpers.decProgress();
					this.setState(
						(state, props) => {
							state = Object.assign({}, state);
							state.phaseStates[nation].Properties =
								js.Properties;
							return state;
						},
						_ => {
							this.props.newPhaseStateHandler(js);
						}
					);
				});
		};
	}
	toggleDIAS(nation) {
		return this.toggleFunc(nation, phaseState => {
			phaseState.Properties.WantsDIAS = !phaseState.Properties.WantsDIAS;
		});
	}
	toggleReady(nation) {
		return this.toggleFunc(nation, phaseState => {
			phaseState.Properties.ReadyToResolve = !phaseState.Properties
				.ReadyToResolve;
		});
	}
	loadPhaseStates() {
		if (!this.props.phase) {
			return;
		}
		let phaseStatesLink = this.props.phase.Links.find(l => {
			return l.Rel == "phase-states";
		});
		if (phaseStatesLink) {
			let loadPromise = helpers
				.safeFetch(helpers.createRequest(phaseStatesLink.URL))
				.then(res => res.json());
			if (this.props.phase.Properties.Resolved) {
				loadPromise = helpers.memoize(phaseStatesLink.URL, _ => {
					return loadPromise;
				});
			} else {
				helpers.incProgress();
			}
			loadPromise.then(js => {
				if (!this.props.phase.Properties.Resolved) {
					helpers.decProgress();
				}
				this.setState((state, props) => {
					state.phaseStates = {};
					state = Object.assign({}, state);
					js.Properties.forEach(phaseState => {
						state.phaseStates[
							phaseState.Properties.Nation
						] = phaseState;
					});
					return state;
				});
			});
		}
	}
	componentDidMount() {
		this.loadPhaseStates();
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			!prevProps.phase ||
			(this.props.phase &&
				this.props.phase.Properties.PhaseOrdinal !=
					prevProps.phase.Properties.PhaseOrdinal)
		) {
			this.loadPhaseStates();
		}
	}
	render() {
		return (
			<div style={{ maxWidth: "960px", margin: "auto" }}>
				<MaterialUI.List>
					{this.props.variant.Properties.Nations.slice()
						.sort((n1, n2) => {
							if (
								this.props.member &&
								n1 == this.props.member.Nation
							) {
								return -1;
							} else if (
								this.props.member &&
								n2 == this.props.member.Nation
							) {
								return 1;
							} else {
								if (n1 < n2) {
									return -1;
								} else if (n2 < n1) {
									return 1;
								} else {
									return 0;
								}
							}
						})
						.map(nation => {
							let phaseState = this.state.phaseStates[nation];
							let hasLink =
								phaseState &&
								phaseState.Links &&
								phaseState.Links.find(l => {
									return l.Rel == "update";
								});
							if (phaseState || this.props.orders[nation]) {
								return (
									<li key={"nation_" + nation}>
										<ul style={{ paddingLeft: "0px" }}>
											<MaterialUI.ListSubheader
												style={{
													backgroundColor: "white",
													padding: "0px 16px",
													margin: "0px",
													display: "flex",
													flexWrap: "wrap"
												}}
												color="primary"
											>
												{nation}

												<div
													style={{ flexGrow: "100" }}
												/>
												<div
													style={{
														alignSelf: "center"
													}}
												>
													<MaterialUI.Tooltip
														className={
															phaseState
																? helpers.scopedClass(
																		phaseState
																			.Properties
																			.ReadyToResolve
																			? ""
																			: "display: none;"
																  )
																: ""
														}
														title="Confirmed their orders"
													>
														<MaterialUI.SvgIcon color="primary">
															<path
																d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M13.4347826,7 L7.70608696,12.7391304 L4.56521739,9.60869565 L3,11.173913 L7.70608696,15.8695652 L15,8.56521739 L13.4347826,7 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
																id="order_confirmed"
															></path>
														</MaterialUI.SvgIcon>
													</MaterialUI.Tooltip>
													{!phaseState ||
													(this.props.member &&
														this.props.member
															.Nation == nation &&
														hasLink) ? (
														""
													) : (
														<MaterialUI.Tooltip
															className={
																phaseState
																	? helpers.scopedClass(
																			phaseState
																				.Properties
																				.WantsDIAS
																				? ""
																				: "display: none;"
																	  )
																	: ""
															}
															title="Wants a draw"
														>
															<MaterialUI.SvgIcon
																color="primary"
																style={{
																	paddingLeft:
																		"8px"
																}}
															>
																<path d="M2.98188996,2.24133335 L3.88833335,3.148 L3.8,3.23743687 L20.7705627,20.2079996 L20.8593333,20.119 L21.3666663,20.6261097 L20.0261097,21.9666663 L14.4292636,16.3704135 C14.0775047,16.5664056 13.6995541,16.7212717 13.301866,16.8285576 L13,16.9 L13,19.08 C15.489899,19.4617845 15.9132657,21.2212572 15.9852522,21.8085585 L16,22 L8,22 L8.00876781,21.8621764 C8.05962111,21.354459 8.40542355,19.5936066 10.7568801,19.1228674 L11,19.08 L11,16.9 C9.11538462,16.5153846 7.61908284,15.0767751 7.15117205,13.224249 L7.1,13 L4,13 C2.95,13 2.0822314,12.1799587 2.00551277,11.1486946 L2,11 L2,4 L2.06033335,4 L1.64133335,3.58188996 L2.98188996,2.24133335 Z M17,2 L17,4 L22,4 L22,11 C22,12.05 21.1799587,12.9177686 20.1486946,12.9944872 L20,13 L16.9,13 C16.852859,13.2309911 16.7898842,13.4561487 16.7122542,13.6742943 L6.99933335,3.962 L7,2 L17,2 Z M4.06033335,6 L4,6 L4,11 L7,11 L6.99933335,8.939 L4.06033335,6 Z M20,6 L17,6 L17,11 L20,11 L20,6 Z"></path>
															</MaterialUI.SvgIcon>
														</MaterialUI.Tooltip>
													)}

													<MaterialUI.Tooltip
														className={
															phaseState
																? helpers.scopedClass(
																		phaseState
																			.Properties
																			.OnProbation
																			? ""
																			: "display: none;"
																  )
																: ""
														}
														title="Did not send orders"
													>
														<MaterialUI.SvgIcon
															color="primary"
															style={{
																paddingLeft:
																	"8px",
																color: "#b71c1c"
															}}
														>
															<path d="M2.98188996,2.24133335 L21.3666663,20.6261097 L20.0261097,21.9666663 L19.0573333,20.998 L19,21 L5,21 C3.95,21 3.0822314,20.1799587 3.00551277,19.1486946 L3,19 L3,5 L3.00233335,4.942 L1.64133335,3.58188996 L2.98188996,2.24133335 Z M12,1 C13.235,1 14.2895,1.7581 14.75196,2.828465 L14.82,3 L19,3 C20.05,3 20.9177686,3.82004132 20.9944872,4.85130541 L21,5 L21,17.963 L16.037,13 L17,13 L17,11 L14.037,11 L12.037,9 L17,9 L17,7 L10.037,7 L6.037,3 L9.18,3 C9.579,1.898 10.5917,1.0848 11.80656,1.006235 L12,1 Z M13.0593333,15 L7,15 L7,17 L15.0593333,17 L13.0593333,15 Z M11.0593333,13 L9.06033335,11 L7,11 L7,13 L11.0593333,13 Z M12,3 C11.45,3 11,3.45 11,4 C11,4.55 11.45,5 12,5 C12.55,5 13,4.55 13,4 C13,3.45 12.55,3 12,3 Z"></path>
														</MaterialUI.SvgIcon>
													</MaterialUI.Tooltip>
												</div>

												{this.props.member &&
												this.props.member.Nation ==
													nation &&
												hasLink ? (
													<div
														style={{
															alignSelf: "center",
															marginLeft: "auto"
														}}
													>
														<MaterialUI.Button
															color="primary"
															variant="outlined"
															style={{
																padding:
																	"4px 8px"
															}}
															onClick={this.toggleDIAS(
																nation
															)}
														>
															<MaterialUI.Checkbox
																checked={
																	phaseState
																		.Properties
																		.WantsDIAS
																}
																disabled={
																	!phaseState.Links ||
																	!phaseState.Links.find(
																		l => {
																			return (
																				l.Rel ==
																				"update"
																			);
																		}
																	)
																}
																style={{
																	padding:
																		"0px 8px 0px 0px"
																}}
																color="primary"
															/>
															Accept a draw
															<MaterialUI.SvgIcon
																style={{
																	paddingLeft:
																		"8px"
																}}
															>
																<path
																	d={
																		phaseState
																			.Properties
																			.WantsDIAS
																			? "M2.98188996,2.24133335 L3.88833335,3.148 L3.8,3.23743687 L20.7705627,20.2079996 L20.8593333,20.119 L21.3666663,20.6261097 L20.0261097,21.9666663 L14.4292636,16.3704135 C14.0775047,16.5664056 13.6995541,16.7212717 13.301866,16.8285576 L13,16.9 L13,19.08 C15.489899,19.4617845 15.9132657,21.2212572 15.9852522,21.8085585 L16,22 L8,22 L8.00876781,21.8621764 C8.05962111,21.354459 8.40542355,19.5936066 10.7568801,19.1228674 L11,19.08 L11,16.9 C9.11538462,16.5153846 7.61908284,15.0767751 7.15117205,13.224249 L7.1,13 L4,13 C2.95,13 2.0822314,12.1799587 2.00551277,11.1486946 L2,11 L2,4 L2.06033335,4 L1.64133335,3.58188996 L2.98188996,2.24133335 Z M17,2 L17,4 L22,4 L22,11 C22,12.05 21.1799587,12.9177686 20.1486946,12.9944872 L20,13 L16.9,13 C16.852859,13.2309911 16.7898842,13.4561487 16.7122542,13.6742943 L6.99933335,3.962 L7,2 L17,2 Z M4.06033335,6 L4,6 L4,11 L7,11 L6.99933335,8.939 L4.06033335,6 Z M20,6 L17,6 L17,11 L20,11 L20,6 Z"
																			: "M17 4V2H7V4H2V11C2 12.1 2.9 13 4 13H7.1C7.5 14.96 9.04 16.5 11 16.9V19.08C8 19.54 8 22 8 22H16C16 22 16 19.54 13 19.08V16.9C14.96 16.5 16.5 14.96 16.9 13H20C21.1 13 22 12.1 22 11V4H17M4 11V6H7V11L4 11M20 11L17 11V6H20L20 11Z"
																	}
																></path>
															</MaterialUI.SvgIcon>
														</MaterialUI.Button>
													</div>
												) : (
													""
												)}
											</MaterialUI.ListSubheader>

											<MaterialUI.List>
												{(
													this.props.orders[nation] ||
													[]
												).map(order => {
													return (
														<MaterialUI.ListItem
															key={order.Name}
														>
															<MaterialUI.ListItemText>
																{order.Name}
															</MaterialUI.ListItemText>
														</MaterialUI.ListItem>
													);
												})}
											</MaterialUI.List>
										</ul>
									</li>
								);
							} else {
								return "";
							}
						})}
				</MaterialUI.List>
				<div
					id="filler"
					className={helpers.scopedClass(`
					min-height: calc(100% - 112px);
					`)}
				/>
				{this.props.member &&
				this.state.phaseStates[this.props.member.Nation] ? (
					<MaterialUI.AppBar
						className={helpers.scopedClass(`
				padding: 16px 48px;
    position: sticky;
    display: flex;
    align-items: center;
    bottom: 0px;
    z-index: 1201;	
    `)}
					>
						<MaterialUI.Button
							color="secondary"
							variant="contained"
							style={{ padding: "6px 16px", width: "214px" }}
							onClick={this.toggleReady(this.props.member.Nation)}
						>
							<MaterialUI.Checkbox
								style={{ padding: "0px 8px 0px 0px" }}
								disabled={
									this.state.phaseStates[
										this.props.member.Nation
									].Properties.NoOrders
								}
								checked={
									this.state.phaseStates[
										this.props.member.Nation
									].Properties.ReadyToResolve
								}
								color="primary"
							/>
							Confirm orders
						</MaterialUI.Button>
						<MaterialUI.Typography variant="caption">
							{this.state.phaseStates[this.props.member.Nation]
								.Properties.NoOrders
								? "You have no orders to give this turn"
								: "When you're ready for the next turn"}
						</MaterialUI.Typography>
					</MaterialUI.AppBar>
				) : (
					""
				)}
			</div>
		);
	}
}
