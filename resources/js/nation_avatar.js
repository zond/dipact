import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class NationAvatar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			userStats: null,
			gameState: this.props.gameState
		};
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.close = this.close.bind(this);
		this.flagLink = this.props.variant.Links.find(l => {
			return l.Rel == "flag-" + this.props.nation;
		});
		this.badger = this.badger.bind(this);
		this.buttoner = this.buttoner.bind(this);
		this.toggleMuted = this.toggleMuted.bind(this);
	}
	close(ev) {
		if (ev) {
			ev.preventDefault();
			ev.stopPropagation();
		}
		this.setState({ dialogOpen: false, picker: null });
	}
	badger(content) {
		if (
			this.state.gameState &&
			this.state.gameState.Properties.Muted instanceof Array &&
			this.state.gameState.Properties.Muted.indexOf(this.props.nation) !=
				-1
		) {
			return this.buttoner(
				<MaterialUI.Badge
					badgeContent={helpers.createIcon("\ue02b")}
					overlap="circle"
				>
					{content}
				</MaterialUI.Badge>
			);
		} else {
			return this.buttoner(content);
		}
	}
	toggleMuted(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		if (this.state.gameState.Properties.Muted == null) {
			this.state.gameState.Properties.Muted = [];
		}
		let idx = this.state.gameState.Properties.Muted.indexOf(
			this.props.nation
		);
		if (idx == -1) {
			this.state.gameState.Properties.Muted.push(this.props.nation);
		} else {
			this.state.gameState.Properties.Muted = this.state.gameState.Properties.Muted.slice(
				0,
				idx
			).concat(this.state.gameState.Properties.Muted.slice(idx + 1));
		}
		let updateLink = this.state.gameState.Links.find(l => {
			return l.Rel == "update";
		});
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(updateLink.URL, {
					headers: {
						"Content-Type": "application/json"
					},
					method: updateLink.Method,
					body: JSON.stringify(this.state.gameState.Properties)
				})
			)
			.then(res => res.json())
			.then(js => {
				helpers.decProgress();
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.gameState.Properties = js.Properties;
					return state;
				});
				this.props.newGameState(js);
			});
	}
	buttoner(content) {
		if (this.member) {
			return (
				<div
					onClick={ev => {
						ev.stopPropagation();
						ev.preventDefault();
						this.setState({ dialogOpen: true });
					}}
				>
					{content}
				</div>
			);
		} else {
			return content;
		}
	}
	render() {
		let avatar = null;
		if (this.flagLink) {
			avatar = this.badger(
				<MaterialUI.Avatar
					className={this.props.className}
					classes={this.props.classes}
					alt={this.props.nation}
					src={this.flagLink.URL}
				/>
			);
		} else if (this.props.nation == helpers.DiplicitySender) {
			avatar = (
				<MaterialUI.Avatar
					className={this.props.className}
					classes={this.props.classes}
					alt={this.props.nation}
					src="https://diplicity-engine.appspot.com/img/otto.png"
				/>
			);
		} else {
			let bgColor = helpers.natCol(this.props.nation, this.props.variant);
			let color =
				helpers.brightnessByColor(bgColor) > 128
					? "#000000"
					: "#ffffff";
			let abbr = this.props.variant.nationAbbreviations[
				this.props.nation
			];
			let fontSize = null;
			if (abbr.length > 3) {
				fontSize = "smaller";
			} else if (abbr.length > 1) {
				fontSize = "small";
			}
			avatar = this.badger(
				<MaterialUI.Avatar
					className={this.props.className}
					classes={this.props.classes}
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
		return (
			<React.Fragment>
				{avatar}
				<MaterialUI.Dialog
					onEntered={helpers.genOnback(this.close)}
					onExited={helpers.genUnback(this.close)}
					open={this.state.dialogOpen}
					disableBackdropClick={false}
					onClose={this.close}
				>
					<MaterialUI.DialogTitle>
						{this.props.nation}
					</MaterialUI.DialogTitle>
					<MaterialUI.DialogContent>
						<MaterialUI.FormControlLabel
							control={
								<MaterialUI.Checkbox
									disabled={
										!this.member ||
										this.props.nation == this.member.Nation
									}
									checked={
										(
											this.state.gameState.Properties
												.Muted || []
										).indexOf(this.props.nation) != -1
									}
									onClick={this.toggleMuted}
								/>
							}
							label="Muted"
						/>
					</MaterialUI.DialogContent>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.Dialog>
			</React.Fragment>
		);
	}
}
