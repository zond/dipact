
export default class Login extends React.Component {
	render() {
		if (this.props.main_state.login_url) {
			return (
				<MaterialUI.Container style={{textAlign: 'center'}} maxWidth="sm">
					<MaterialUI.Button variant="contained" startIcon={<i className="material-icons">&#xE898;</i>}>
						<a href={this.props.main_state.login_url}>Login</a>
					</MaterialUI.Button>
				</MaterialUI.Container>
			);
		} else {
			return (
				<MaterialUI.Container style={{textAlign: 'center'}} maxWidth="sm">
					<MaterialUI.CircularProgress />
				</MaterialUI.Container>
			);
		}
	}
}
