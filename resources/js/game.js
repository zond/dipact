import * as helpers from '%{ cb "./helpers.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == this.props.user.Email;
		});
	}
	renderPhase(phase) {
		console.log(phase);
	}
	componentDidMount() {
		Promise.all([
			fetch(
				helpers.createRequest(
					"/Variant/" +
						this.props.game.Properties.Variant +
						"/Map.svg"
				)
			).then(resp => resp.text()),
			fetch(
				helpers.createRequest(
					"/Variant/" + this.props.game.Properties.Variant
				)
			).then(resp => resp.json())
		]).then(values => {
			let mapSVG = values[0];
			let variant = values[1];
			document.getElementById("map").innerHTML = mapSVG;
			this.map = dippyMap($("#map"));
			window.dippyMap = map;
			if (this.props.game.Properties.Started) {
			} else {
				fetch(
					helpers.createRequest(
						"/Variant/" +
							this.props.game.Properties.Variant +
							"/Start"
					)
				)
					.then(resp => resp.json())
					.then(this.renderPhase);
			}
		});
	}
	render() {
		return [
			<MaterialUI.AppBar key="top-nav" position="static">
				<MaterialUI.Toolbar
					style={{ display: "flex", justifyContent: "space-between" }}
				>
					<MaterialUI.IconButton onClick={this.props.close}>
						{helpers.createIcon("\ue5cd")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue0b7")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue8b8")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue86c")}
					</MaterialUI.IconButton>
				</MaterialUI.Toolbar>
			</MaterialUI.AppBar>,
			<div key="div" style={{ display: "flex" }} id="map"></div>
		];
	}
}
