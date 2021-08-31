/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import gtag from "ga-gtag";
import {
	Button,
	Switch,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const styles = (theme) => ({
	dialogActions: {
		backgroundColor: "white",
		position: "sticky",
		bottom: "0px",
	},
	paper: {
		margin: "2px",
		width: "100%",
	},
});

class PreliminaryScores extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, canvas: null, chart: null, show: "score" };
		this.close = this.close.bind(this);
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false, canvas: null, chart: null });
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.open && !this.state.canvas) {
			const canvas = document.getElementById("score-chart");
			if (!canvas) {
				this.setState({ open: this.state.open });
			} else {
				this.setState({ canvas: canvas });
			}
		}
		if (
			this.state.open &&
			this.state.canvas &&
			(!this.state.chart || this.state.show !== prevState.show)
		) {
			const adjustmentPhases = this.props.phases.filter((p) => {
				return p.Properties.Type === "Adjustment";
			});
			const labels = adjustmentPhases.map((p) => {
				return "" + p.Properties.Year;
			});
			const datasets = this.props.variant.Properties.Nations.map(
				(nation) => {
					const col = helpers.natCol(nation, this.props.variant);
					return {
						label: nation,
						borderColor: col,
						lineTension: 0,
						fill: false,
						data: adjustmentPhases.map((phase) => {
							const score =
								phase.Properties.PreliminaryScores.find(
									(score) => {
										return score.Member === nation;
									}
								);
							if (score) {
								return helpers.twoDecimals(
									this.state.show === "score"
										? score.Score
										: score.SCs
								);
							}
							return 0;
						}),
					};
				}
			);
			const config = {
				type: "line",
				data: {
					labels: labels,
					datasets: datasets,
				},
				options: {
					tooltips: {
						callbacks: {
							footer: (tooltipItems, data) => {
								return tooltipItems
									.map((item) => {
										const nation =
											this.props.variant.Properties
												.Nations[item.datasetIndex];
										const score = adjustmentPhases[
											item.index
										].Properties.PreliminaryScores.find(
											(score) => {
												return score.Member === nation;
											}
										);
										if (this.state.show === "score") {
											return (
												nation +
												": " +
												(score ? score.SCs : "0") +
												" supply centers"
											);
										} else {
											return (
												nation +
												": " +
												(score
													? helpers.twoDecimals(
															score.Score
													  )
													: "0") +
												" points"
											);
										}
									})
									.join("\n");
							},
						},
						footerFontStyle: "normal",
					},
					legend: {
						display: true,
						align: "start",
						labels: {
							fontColor: "rgba(0, 0, 0, 0.87)",
							boxWidth: 12,
						},
					},
				},
			};
			if (this.state.chart) {
				this.state.chart.data = config.data;
				this.state.chart.update();
			} else {
				this.setState({
					chart: new Chart(
						this.state.canvas.getContext("2d"),
						config
					),
				});
			}
		}
		if (this.state.open && this.state.canvas && this.state.chart) {
			this.state.chart.update();
		}
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "PreliminaryScores",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	render() {
		const { classes } = this.props;
		if (!this.state.open) {
			return "";
		}
		return (
			<Dialog
				TransitionProps={{
					onEnter: helpers.genOnback(this.close),
				}}
				open={this.state.open}
				classes={{
					paper: classes.paper,
				}}
				onClose={this.close}
			>
				<DialogTitle>Scores</DialogTitle>
				<DialogContent>
					<Typography>
						If the game ends in a draw, points will be divided as
						below (based on the{" "}
						<a href="http://windycityweasels.org/tribute-scoring-system/">
							Tribute
						</a>{" "}
						system).
					</Typography>
					Score{" "}
					<Switch
						checked={this.state.show !== "score"}
						onChange={(ev) => {
							this.setState({
								show: ev.target.checked ? "scs" : "score",
							});
						}}
					/>{" "}
					Supply centers
					<canvas id="score-chart" height="520" width="420"></canvas>
					<DialogActions className={classes.dialogActions}>
						<Button onClick={this.close} color="primary">
							Close
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PreliminaryScores);
