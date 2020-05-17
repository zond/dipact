import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class Color extends React.Component {
	constructor(props) {
		super(props);
		this.state = { dialogOpen: false, picker: null, value: props.value };
		this.fieldID = "picker" + Math.floor(1000000000 * Math.random());
		this.select = this.select.bind(this);
		this.close = this.close.bind(this);
	}
	close() {
		helpers.unback(this.close);
		this.setState({ dialogOpen: false, picker: null });
	}
	select() {
		helpers.unback(this.close);
		this.setState({ dialogOpen: false, picker: null }, _ => {
			if (this.props.onSelect) {
				this.props.onSelect(this.state.value);
			}
		});
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!this.state.picker && this.state.dialogOpen) {
			const container = document.getElementById(this.fieldID);
			if (!container) {
				this.setState({ dialogOpen: this.state.dialogOpen });
			} else {
				this.setState(
					{
						picker: new iro.ColorPicker(container, {
							color: this.state.value
						})
					},
					_ => {
						this.state.picker.on("color:change", color => {
							this.setState({ value: color.hexString });
						});
						gtag("set", { "page_title": "Color", "page_location": location.href });
						gtag("event", "page_view");
					}
				);
			}
		}
	}
	render() {
		return (
			<React.Fragment>
				<MaterialUI.Button
					style={{ backgroundColor: this.state.value, margin: "0px 8px" }}
					onClick={_ => {
						this.setState({ dialogOpen: true });
					}}
				>
					{this.state.value}
				</MaterialUI.Button>
				<MaterialUI.Dialog
					onEntered={helpers.genOnback(this.close)}
					open={this.state.dialogOpen}
					disableBackdropClick={false}
					onClose={this.close}
				>
					<MaterialUI.DialogContent>
						<div id={this.fieldID}></div>
					</MaterialUI.DialogContent>
					<MaterialUI.DialogActions>
						<MaterialUI.Button
							onClick={this.select}
							color="primary"
						>
							Select
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.Dialog>
			</React.Fragment>
		);
	}
}
