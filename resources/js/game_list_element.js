import * as helpers from '%{ cb "./helpers.js" }%';

export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == this.props.user.Email;
		});
	}
	getIcons() {
		let icons = [];
		if (
			this.member != null &&
			this.props.game.Properties.Started &&
			!this.props.game.Properties.Finished
		) {
			let k = 0;
			if (!this.member.NewestPhaseState.OnProbation) {
				icons.push(
					<i
						key={k++}
						style={{ color: "red", fontSize: "14px" }}
						className="material-icons"
					>
						&#xe88b;
					</i>
				);
			}
			if (!this.member.NewestPhaseState.ReadyToResolve) {
				icons.push(
					<i
						key={k++}
						style={{ color: "green", fontSize: "14px" }}
						className="material-icons"
					>
						&#xe877;
					</i>
				);
			}
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
		return (
			<MaterialUI.ExpansionPanel>
				<MaterialUI.ExpansionPanelSummary
					className="game-summary"
					expandIcon={<i className="material-icons">&#xE5Cf;</i>}
				>
					<MaterialUI.Grid container>
						<MaterialUI.Grid item xs={11}>
							<MaterialUI.Typography
								textroverflow="ellipsis"
								noWrap={true}
							>
								{this.props.game.Name}
							</MaterialUI.Typography>
						</MaterialUI.Grid>
						<MaterialUI.Grid item xs={1}>
							<MaterialUI.Typography>
								{this.props.game.Properties.NMembers}/
								{
									this.getVariant(
										this.props.game.Properties.Variant
									).Properties.Nations.length
								}{" "}
							</MaterialUI.Typography>
						</MaterialUI.Grid>
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
				<MaterialUI.ExpansionPanelDetails>
					<MaterialUI.Typography>
						{JSON.stringify(this.props.game)}
					</MaterialUI.Typography>
				</MaterialUI.ExpansionPanelDetails>
			</MaterialUI.ExpansionPanel>
		);
	}
}
