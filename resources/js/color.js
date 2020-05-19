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
		const val = this.state.value;
		if (val.length == 7 || val.length == 4 || val.length == 9) {
			if (/#[0-9a-fA-F]*/.exec(val)) {
				this.setState({ dialogOpen: false, picker: null }, _ => {
					if (this.props.onSelect) {
						this.props.onSelect(this.state.value);
					}
				});
			}
		}
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			prevState.value != this.state.value &&
			this.state.picker &&
			this.state.dialogOpen
		) {
			const val = this.state.value;
			if (val.length == 7 || val.length == 4 || val.length == 9) {
				if (/#[0-9a-fA-F]*/.exec(val)) {
					this.state.picker.setColors([this.state.value]);
				}
			}
		}
		if (prevProps.value != this.props.value) {
			this.setState({ value: this.props.value });
		}
		if (!this.state.picker && this.state.dialogOpen) {
			const container = document.getElementById(this.fieldID);
			if (!container) {
				this.setState({ dialogOpen: this.state.dialogOpen });
			} else {
				this.setState(
					{
						picker: new iro.ColorPicker(container, {
							color: this.state.value,
							width: 208
						})
					},
					_ => {
						this.state.picker.on("color:change", color => {
							this.setState({ value: color.hexString });
						});
						gtag("set", {
							page_title: "Color",
							page_location: location.href
						});
						gtag("event", "page_view");
					}
				);
			}
		}
	}
	render() {
		return (
			<React.Fragment>
				<div
					onClick={_ => {
						this.setState({ dialogOpen: true });
					}}
					style={{ display: "flex", alignItems: "center " }}
				>
					<MaterialUI.Button
						style={{
							backgroundColor: this.state.value,
							color:
								helpers.brightnessByColor(this.state.value) <
								127
									? "white"
									: "black",
							margin: "0px 8px"
						}}
					>
						{this.state.value}
					</MaterialUI.Button>

					{this.props.edited ? (
						<div style={{ color: "#281A1A" }}>
							{helpers.createIcon("\ue3c9")}
						</div>
					) : (
						""
					)}
				</div>
				<MaterialUI.Dialog
					onEntered={helpers.genOnback(this.close)}
					open={this.state.dialogOpen}
					disableBackdropClick={false}
					onClose={this.close}
				>
					<MaterialUI.DialogContent>
						<div id={this.fieldID}></div>
						<MaterialUI.TextField
							key="hex"
							label="Hexcode"
							margin="dense"
							fullWidth
							value={this.state.value}
							onChange={ev => {
								this.setState({
									value: ev.target.value
								});
							}}
						/>
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
