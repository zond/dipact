import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class NationAvatar extends React.Component {
	constructor(props) {
		super(props);
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.variant;
		});
		this.flagLink = this.variant.Links.find(l => {
			return l.Rel == "flag-" + this.props.nation;
		});
	}
	render() {
		if (this.flagLink) {
			return (
				<MaterialUI.Avatar
					className="avatar"
					alt={this.props.nation}
					src={this.flagLink.URL}
				/>
			);
		} else {
			let bgColor =
				Globals.contrastColors[
					this.variant.Properties.Nations.indexOf(this.props.nation)
				];
			let color =
				helpers.brightnessByColor(bgColor) > 128
					? "#000000"
					: "#ffffff";
			let abbr = this.variant.nationAbbreviations[this.props.nation];
			let fontSize = null;
			if (abbr.length > 3) {
				fontSize = "smaller";
			} else if (abbr.length > 1) {
				fontSize = "small";
			}
			return (
				<MaterialUI.Avatar
					className="avatar"
					alt={this.props.nation}
					style={{
						backgroundColor: bgColor,
						color: color,
						fontSize: fontSize
					}}
				>
					{abbr}
				</MaterialUI.Avatar>
			);
		}
	}
}
