export default class Notifications extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<MaterialUI.List>
					<MaterialUI.ListItem div>
						<MaterialUI.ListItemText primary="NEWS: Diplicity has a new React-based UI." />
					</MaterialUI.ListItem>
					<MaterialUI.ListItem div>
						<MaterialUI.ListItemText primary="MESSAGE: [Fra-Eng] Please stop bouncing in the English Channel." />
					</MaterialUI.ListItem>
					<MaterialUI.ListItem div>
						<MaterialUI.ListItemText primary="INFO: No idea how this will be populated yet." />
					</MaterialUI.ListItem>
				</MaterialUI.List>
			</div>
		);
	}
}