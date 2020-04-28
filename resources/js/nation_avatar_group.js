import * as helpers from '%{ cb "/js/helpers.js" }%';

import NationAvatar from '%{ cb "/js/nation_avatar.js" }%';

const groupContainer = helpers.scopedClass(`
  background-color: rgba(40, 26, 26, 1);
  width: 40px;
  border-radius: 100px;
  margin-top: 10px;
  clip-path: circle(50% at 50% 50%);
`);
const avatarRow1 = helpers.scopedClass(`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(40px);
  width: 40px;
`);
const avatarRow2 = helpers.scopedClass(`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(40px);
  width: 60px;
  margin-left: -10px;
`);
const avatarRow34 = helpers.scopedClass(`
  display: flex;
  justify-content: center;
  height: calc(40px / 2);
  width: 40px;
`);
const avatarRow59 = helpers.scopedClass(`
  display: flex;
  justify-content: center;
  height: calc(39px / 3);
  width: 39px;
`);
const avatar1 = helpers.scopedClass(`
  height: calc(36px) !important;
  width: calc(36px) !important;
`);
const avatar2 = helpers.scopedClass(`
  height: calc(40px / 1.5) !important;
  width: calc(40px / 1.5) !important;
`);
const avatar34 = helpers.scopedClass(`
  height: calc(40px / 2) !important;
  width: calc(40px / 2) !important;
`);
const avatar59 = helpers.scopedClass(`
  height: calc(39px / 3) !important;
  width: calc(39px / 3) !important;
  flex-basis: 1;
`);

export default class NationAvatarGroup extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		if (
			this.props.nations.length ==
			this.props.variant.Properties.Nations.length
		) {
			return (
				<div
					className={groupContainer}
					style={{ backgroundColor: "unset" }}
				>
					<div className={avatarRow1}>
						<MaterialUI.Avatar
							style={{ border: "none" }}
							classes={{ root: avatar1 }}
							key="Everyone"
							alt="Everyone"
							src="/static/img/un_logo.svg"
						/>
					</div>
				</div>
			);
		} else if (this.props.nations.length == 1) {
			return (
				<div className={groupContainer}>
					<div className={avatarRow1}>
						<NationAvatar
							gameState={this.props.gameState}
							newGameState={this.props.newGameState}
							game={this.props.game}
							nation={this.props.nations[0]}
							variant={this.props.variant}
							classes={{ root: avatar1 }}
						/>
					</div>
				</div>
			);
		} else if (this.props.nations.length == 2) {
			return (
				<div className={groupContainer}>
					<div className={avatarRow2}>
						<NationAvatar
							gameState={this.props.gameState}
							key={this.props.nations[0]}
							newGameState={this.props.newGameState}
							game={this.props.game}
							nation={this.props.nations[0]}
							variant={this.props.variant}
							classes={{ root: avatar2 }}
						/>
						<NationAvatar
							gameState={this.props.gameState}
							key={this.props.nations[1]}
							nation={this.props.nations[1]}
							newGameState={this.props.newGameState}
							game={this.props.game}
							variant={this.props.variant}
							classes={{ root: avatar2 }}
						/>
					</div>
				</div>
			);
		} else if (this.props.nations.length < 5) {
			return (
				<div className={groupContainer}>
					<div className={avatarRow34}>
						<NationAvatar
							gameState={this.props.gameState}
							newGameState={this.props.newGameState}
							game={this.props.game}
							key={this.props.nations[0]}
							nation={this.props.nations[0]}
							variant={this.props.variant}
							classes={{ root: avatar34 }}
						/>
						<NationAvatar
							gameState={this.props.gameState}
							key={this.props.nations[1]}
							newGameState={this.props.newGameState}
							game={this.props.game}
							nation={this.props.nations[1]}
							variant={this.props.variant}
							classes={{ root: avatar34 }}
						/>
					</div>
					<div className={avatarRow34}>
						<NationAvatar
							gameState={this.props.gameState}
							key={this.props.nations[2]}
							newGameState={this.props.newGameState}
							game={this.props.game}
							nation={this.props.nations[2]}
							variant={this.props.variant}
							classes={{ root: avatar34 }}
						/>
						{this.props.nations.length > 3 ? (
							<NationAvatar
								newGameState={this.props.newGameState}
								game={this.props.game}
								gameState={this.props.gameState}
								key={this.props.nations[3]}
								nation={this.props.nations[3]}
								variant={this.props.variant}
								classes={{ root: avatar34 }}
							/>
						) : (
							""
						)}
					</div>
				</div>
			);
		} else {
			const row0 = [];
			const row1 = [];
			const row2 = [];
			if (this.props.nations.length == 5) {
				row0.push(this.props.nations[0]);
				row1.push(this.props.nations[1]);
				row1.push(this.props.nations[2]);
				row1.push(this.props.nations[3]);
				row2.push(this.props.nations[4]);
			} else {
				this.props.nations.forEach(nation => {
					if (row0.length < 3) {
						row0.push(nation);
					} else if (row1.length < 3) {
						row1.push(nation);
					} else if (row2.length < 3) {
						row2.push(nation);
					}
				});
			}
			return (
				<div className={groupContainer}>
					<div className={avatarRow59}>
						{row0.map(nation => {
							return (
								<NationAvatar
									key={nation}
									gameState={this.props.gameState}
									nation={nation}
									newGameState={this.props.newGameState}
									game={this.props.game}
									variant={this.props.variant}
									classes={{ root: avatar59 }}
								/>
							);
						})}
					</div>
					<div className={avatarRow59}>
						{row1.map(nation => {
							return (
								<NationAvatar
									key={nation}
									nation={nation}
									gameState={this.props.gameState}
									newGameState={this.props.newGameState}
									game={this.props.game}
									variant={this.props.variant}
									classes={{ root: avatar59 }}
								/>
							);
						})}
					</div>
					{row2.length > 0 ? (
						<div className={avatarRow59}>
							{row2.map(nation => {
								return (
									<NationAvatar
										key={nation}
										nation={nation}
										variant={this.props.variant}
										newGameState={this.props.newGameState}
										game={this.props.game}
										gameState={this.props.gameState}
										classes={{ root: avatar59 }}
									/>
								);
							})}
						</div>
					) : (
						""
					)}
				</div>
			);
		}
	}
}
