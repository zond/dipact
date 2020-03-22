export default class Login extends React.Component {
	render() {
		if (this.props.loginURL) {
			return (
				<MaterialUI.Container
					style={{ textAlign: "center" }}
					maxWidth="sm"
				>
					<a href={this.props.loginURL}>
						<MaterialUI.Button
							variant="contained"
							startIcon={
								<i className="material-icons">&#xE898;</i>
							}
						>
							Login
						</MaterialUI.Button>
					</a>
				</MaterialUI.Container>
			);
		} else {
			return "";
		}
	}
}
