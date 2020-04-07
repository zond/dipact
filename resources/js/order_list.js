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
				.then(_ => {
					helpers.decProgress();
					this.setState(
						(state, props) => {
							state = Object.assign({}, state);
							state.phaseStates[nation] = phaseState;
							return state;
						},
						_ => {
							this.props.newPhaseStateHandler(phaseState);
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
			<MaterialUI.List>
				{this.props.variant.Properties.Nations.map(nation => {
					let phaseState = this.state.phaseStates[nation];
					return (
						<li key={"nation_" + nation}>
							<ul>
								<MaterialUI.ListSubheader
									style={{
										backgroundColor: "white"
									}}
								>
									{nation}
								</MaterialUI.ListSubheader>
								<MaterialUI.List>
									{(this.props.orders[nation] || []).map(
										order => {
											return (
												<MaterialUI.ListItem
													key={order.Name}
												>
													<MaterialUI.ListItemText>
														{order.Name}
													</MaterialUI.ListItemText>
												</MaterialUI.ListItem>
											);
										}
									)}
								</MaterialUI.List>
								{phaseState ? (
									<MaterialUI.FormGroup>
										<MaterialUI.FormControlLabel
											control={
												<MaterialUI.Checkbox
													checked={
														phaseState.Properties
															.ReadyToResolve
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
													onChange={this.toggleReady(
														nation
													)}
												/>
											}
											label="Ready for next turn"
										/>
										<MaterialUI.FormControlLabel
											control={
												<MaterialUI.Checkbox
													checked={
														phaseState.Properties
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
													onChange={this.toggleDIAS(
														nation
													)}
												/>
											}
											label="Wants draw"
										/>
										<MaterialUI.FormControlLabel
											control={
												<MaterialUI.Checkbox
													checked={
														phaseState.Properties
															.OnProbation
													}
													disabled={true}
												/>
											}
											label="Assumed inactive"
										/>
									</MaterialUI.FormGroup>
								) : (
									""
								)}
							</ul>
						</li>
					);
				})}
			</MaterialUI.List>
		);
	}
}
