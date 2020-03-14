import * as helpers from '%{ cb "./helpers.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == this.props.user.Email;
		});
	}
	render() {
		return <p>Hello, I am {this.props.game.Properties.ID}</p>;
	}
}
