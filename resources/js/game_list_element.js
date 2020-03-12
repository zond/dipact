import * as helpers from '%{ cb "./helpers.js" }%';

export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == this.props.user.Email;
		});
	}
	addIcon(ary, codepoint, color) {
		ary.push(
			<i
				key={ary.length}
				style={{ padding: "1px", color: color, fontSize: "16px" }}
				className="material-icons"
			>
				{codepoint}
			</i>
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
