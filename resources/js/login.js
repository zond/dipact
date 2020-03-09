
export default class Login extends React.Component {
	render() {
		if (this.props.parent_state.urls.login_url) {
			return (
				<MaterialUI.Container style={{textAlign: 'center'}} maxWidth="sm">
					<a href={this.props.parent_state.urls.login_url}>
				        <MaterialUI.Button variant="contained" startIcon={<i className="material-icons">&#xE898;</i>}>
				             Login
    					</MaterialUI.Button>
				    </a>
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
