export default class Login extends React.Component {

	render() {
		if (this.props.loginURL) {
			return (
				<MaterialUI.Container
					style={{ textAlign: "center", "verticalAlign":"middle"}}
					maxWidth="sm"
				>
					<a href={this.props.loginURL} style={{"textDecoration":"none","textTransform":"none"}}>
						<MaterialUI.Button
							variant="contained"
							style={{"backgroundColor":"white", "color":"#757575"}}
							startIcon={
								<i><img src={"/static/img/google_icon.svg"} /> </i>
							}
							>
							Sign in with Google
						</MaterialUI.Button>
					</a>
				</MaterialUI.Container>
			);
		} else {
			return "";
		}
	}
}
