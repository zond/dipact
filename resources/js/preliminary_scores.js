import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class PreliminaryScores extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, canvas: null, chart: null };
		this.close = this.close.bind(this);
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
	}
	componentDidMount() {
		Globals.backListeners.unshift(this.close);
	}
	componentWillUnmount() {
		Globals.backListeners = Globals.backListeners.filter(l => {
			return l != this.props.close;
		});
	}
	close() {
		this.setState({ open: false, canvas: null, chart: null });
	}
	componentDidUpdate() {
		if (this.state.open && !this.state.canvas) {
			const canvas = document.getElementById("score-chart");
			if (!canvas) {
				this.setState({ open: this.state.open });
			} else {
				this.setState({ canvas: canvas });
			}
		}
		if (this.state.open && this.state.canvas && !this.state.chart) {
			const adjustmentPhases = this.props.phases.filter(p => {
				return p.Properties.Type == "Adjustment";
			});
			const labels = adjustmentPhases.map(p => {
				return "" + p.Properties.Year;
			});
			const datasets = this.props.variant.Properties.Nations.map(
				nation => {
					const col = helpers.natCol(nation, this.props.variant);
					return {
						label: nation,
						borderColor: col,
						lineTension: 0,
						fill: false,
						data: adjustmentPhases.map(phase => {
							const score = phase.Properties.PreliminaryScores.find(
								score => {
									return score.Member == nation;
								}
							);
							if (score) {
								return helpers.twoDecimals(score.Score);
							}
							return 0;
						})
					};
				}
			);
			this.setState({
				chart: new Chart(this.state.canvas.getContext("2d"), {
					type: "line",
					data: {
						labels: labels,
						datasets: datasets
					},
					options: {
						tooltips: {
							callbacks: {
								footer: (tooltipItems, data) => {
									return tooltipItems
										.map(item => {
											const nation = this.props.variant
												.Properties.Nations[
												item.datasetIndex
											];
											const score = adjustmentPhases[
												item.index
											].Properties.PreliminaryScores.find(
												score => {
													return (
														score.Member == nation
													);
												}
											);
											return (
												nation +
												": " +
												(score ? score.SCs : "0") +
												" supply centers"
											);
										})
										.join("\n");
								}
							},
							footerFontStyle: "normal"
						}
					}
				})
			});
		}
		if (this.state.open && this.state.canvas && this.state.chart) {
			this.state.chart.update();
		}
	}
	render() {
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				disableBackdropClick={false}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Scores</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.Typography>
						This chart represents the scoreboard for each year of
						the game, if the game would have ended that year. The
						scoring system used is the{" "}
						<a href="http://windycityweasels.org/tribute-scoring-system/">
							Tribute
						</a>{" "}
						ssytem.
					</MaterialUI.Typography>
					<canvas id="score-chart" width="480" height="720"></canvas>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
