class Login extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="row">
					{/* Three columns as a quick way to make the login button look centred. */}
					<div className="col-sm" />
					<div className="col-sm">
						<button>
							<a href={this.props.loginURL}>Login</a>
						</button>
					</div>
					<div className="col-sm" />
				</div>
			</div>
		);
	}
}
