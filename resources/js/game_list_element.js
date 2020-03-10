export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
	}
	getVariant(name) {
		let v = this.props.variants.find(v => {
			return v.Name == name;
		});
		if (v) {
			return v;
		}
		return { Properties: {Nations: [] } };
	}
	render() {
		console.log('rendering element with', this.props.variants);
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
									this.getVariant(this.props.game.Properties.Variant)
										.Properties.Nations.length
								}{" "}
							</MaterialUI.Typography>
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
