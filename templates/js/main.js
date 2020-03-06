class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.url = new URL(window.location.href);
		this.token = this.url.searchParams.get('token');
		this.serverURL = new URL('https://diplicity-engine.appspot.com/');
		if (this.token) {
			this.serverURL.searchParams.set('token', this.token);
			this.url.searchParams.delete('token');
			history.pushState('', '', this.url.toString());
		}
		fetch(this.serverURL.toString(), { headers: { 'Accept': 'application/json' } })
			.then(resp => resp.json())
			.then(js => {
				this.setState({ user: js.Properties.User });
				let loginLink = js.Links.find(l => { return l.Rel == 'login'; });
				if (loginLink) {
					let loginURL = new URL(loginLink.URL);
					loginURL.searchParams.set('redirect-to', this.url.toString());
					this.setState({ loginURL: loginURL });
				}
			});
	}
	login() {
		window.location.href = this.loginURL.toString();
	}
	render() {
		if (this.state.user) {
			return React.createElement(MainMenu, { state: this.state }, null);
		} else {
			return React.createElement(Login, { loginURL: this.state.loginURL }, null);
		}
	}
}
