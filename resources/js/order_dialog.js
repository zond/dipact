export default class OrderDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, options: [] };
		Globals.order_dialog = this;
	}
	render() {
		return (
			<MaterialUI.Dialog open={this.state.open}>
				<MaterialUI.List>
					{this.state.options.map(option => {
						return (
							<MaterialUI.ListItem key={option}>
								<MaterialUI.ListItemText>
									{option}
								</MaterialUI.ListItemText>
							</MaterialUI.ListItem>
						);
					})}
				</MaterialUI.List>
			</MaterialUI.Dialog>
		);
	}
}
