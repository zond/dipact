export default class ActivityContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	setActivity(activity, props = null) {
		this.setState({activity: activity, activity_props: props});
	}
	renderActivity() {
		let props = this.state.activity_props ? Object.assign({}, this.state.activity_props) : {};
		props.parent_state = this.state;
		return React.createElement(this.state.activity, props);
	}
	render() {
		return this.renderActivity();
	}
}

