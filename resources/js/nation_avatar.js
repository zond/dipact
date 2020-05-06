import * as helpers from '%{ cb "/js/helpers.js" }%';

import StatsDialog from '%{ cb "/js/stats_dialog.js" }%';

/*
 * MUST HAVE:
 * - nation: The nation string.
 * - variant: A variant object.
 * MIGHT HAVE:
 * - game: A game object.
 *         Will enable opening a stats dialog when clicked.
 * - gameState: A game state object representing the config of the logged in user for the current game.
 *              Will badge the icon if the nation is muted.
 *              Forwarded to the stats dialog.
 * - onNewGameState: A callback to run with the new game state if it gets changed (due to muting the user in the game).
 *                   Forwarded to the stats dialog.
 */
export default class NationAvatar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { dialogOpen: false };
		this.member = this.props.game
			? this.props.game.Properties.Members.find(e => {
					return e.User.Email == Globals.user.Email;
			  })
			: null;
		this.flagLink = this.props.variant.Links.find(l => {
			return l.Rel == "flag-" + this.props.nation;
		});
		this.badger = this.badger.bind(this);
		this.buttoner = this.buttoner.bind(this);
	}
	badger(content) {
		if (
			this.props.gameState &&
			(this.props.gameState.Properties.Muted || []).indexOf(
				this.props.nation
			) != -1
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
	buttoner(content) {
		if (this.member && this.props.gameState) {
			return (
				<div
					onClick={ev => {
						if (ev) {
							ev.stopPropagation();
							ev.preventDefault();
						}
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
				{this.state.dialogOpen ? (
					<StatsDialog
						game={this.props.game}
						onClose={ev => {
							if (ev) {
								ev.stopPropagation();
								ev.preventDefault();
							}
							this.setState({ dialogOpen: false });
						}}
						user={
							this.props.game.Properties.Members.find(m => {
								return m.Nation == this.props.nation;
							}).User
						}
						gameState={this.props.gameState}
						onNewGameState={this.props.onNewGameState}
					/>
				) : (
					""
				)}
			</React.Fragment>
		);
	}
}
