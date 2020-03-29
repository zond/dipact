export default class Login extends React.Component {

	render() {
		if (this.props.loginURL) {
			return (
				<MaterialUI.Container
					style={{ textAlign: "center","paddingTop":"50px"}}
				>
				<p><MaterialUI.Typography variant="h2">Welcome to DipAct</MaterialUI.Typography></p>
				<p><MaterialUI.Typography variant="body1">The work-in-progress web version of Diplicity.</MaterialUI.Typography></p>
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
