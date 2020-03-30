import GameList from '%{ cb "/js/game_list.js" }%';

export default class Notifications extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<MaterialUI.List>
				<MaterialUI.ListItem>
					<MaterialUI.ListItemText primary="NEWS: Diplicity has a new React-based UI." />
				</MaterialUI.ListItem>
				<li key="started">
					<ul style={{ paddingInlineStart: 0 }}>
						<MaterialUI.ListSubheader>
							Started
						</MaterialUI.ListSubheader>
						<MaterialUI.ListItem>
							<GameList
								expansionPanelWrapped={true}
								url={this.props.urls["my-started-games"]}
								limit={8}
								skipMore={true}
							/>
						</MaterialUI.ListItem>
					</ul>
				</li>
				<li key="staging">
					<ul style={{ paddingInlineStart: 0 }}>
						<MaterialUI.ListSubheader>
							Staging
						</MaterialUI.ListSubheader>
						<MaterialUI.ListItem>
							<GameList
								expansionPanelWrapped={true}
								url={this.props.urls["my-staging-games"]}
								limit={8}
								skipMore={true}
							/>
						</MaterialUI.ListItem>
					</ul>
				</li>
				<li key="finished">
					<ul style={{ paddingInlineStart: 0 }}>
						<MaterialUI.ListSubheader>
							Finished
						</MaterialUI.ListSubheader>
						<MaterialUI.ListItem>
							<GameList
								expansionPanelWrapped={true}
								url={this.props.urls["my-finished-games"]}
								limit={8}
								skipMore={true}
							/>
						</MaterialUI.ListItem>
					</ul>
				</li>
			</MaterialUI.List>
		);
	}
}
