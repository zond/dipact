export default class ActivityContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	setActivity(activity, props = null) {
		this.setState({ activity: activity, activityProps: props });
	}
	renderActivity() {
		return React.createElement(
			this.state.activity,
			this.state.activityProps
		);
	}
	render() {
		return this.renderActivity();
	}
}
