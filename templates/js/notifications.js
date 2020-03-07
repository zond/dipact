export default class Notifications extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<MaterialUI.div>
				<MaterialUI.List>
					<MaterialUI.ListItem div>
						NEWS: Diplicity has a new React-based UI.
					</MaterialUI.ListItem>
					<MaterialUI.ListItem div>
						MESSAGE: [Fra-Eng] Please stop bouncing in the English Channel.
					</MaterialUI.ListItem>
					<MaterialUI.ListItem div>
						INFO: No idea how this will be populated yet.
					</MaterialUI.ListItem>
				</MaterialUI.List>
			</MaterialUI.div>
		);
	}
}