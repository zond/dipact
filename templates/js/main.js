import Login from './login.js';
import MainMenu from './main_menu.js';
import Notifications from './notifications.js';
import ActivityContainer from './activity_container.js';

export default class Main extends ActivityContainer {
	constructor(props) {
		super(props);
		this.state = {activity: Login};
	}
	componentDidMount() {
		this.url = new URL(window.location.href);
		this.token = this.url.searchParams.get('token');
		this.server_url = new URL('https://diplicity-engine.appspot.com/');
		if (this.token) {
			this.server_url.searchParams.set('token', this.token);
			this.url.searchParams.delete('token');
			history.pushState('', '', this.url.toString());
			this.setActivity(MainMenu);
		}
		fetch(this.server_url.toString(), { headers: { 'Accept': 'application/json' } })
			.then(resp => resp.json())
			.then(js => {
				this.setState({ user: js.Properties.User });
				let loginLink = js.Links.find(l => { return l.Rel == 'login'; });
				if (loginLink) {
					let login_url = new URL(loginLink.URL);
					login_url.searchParams.set('redirect-to', this.url.toString());
					this.setState({login_url: login_url});
				}
			});
	}
}
