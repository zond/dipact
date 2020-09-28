import * as helpers from '%{ cb "/js/helpers.js" }%';

import UserAvatar from '%{ cb "/js/user_avatar.js" }%';

export default class GameMetadata extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		let cells = [];
		cells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
				key={cells.length}
			>
				<MaterialUI.Icon style={{ marginRight: "8px" }}>
					{helpers.createIcon("\ue55b")}
				</MaterialUI.Icon>
				<MaterialUI.Typography>
					Game variant: {this.props.game.Properties.Variant}
				</MaterialUI.Typography>
			</div>
		);
		cells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
				key={cells.length}
			>
				<MaterialUI.Icon style={{ marginRight: "8px" }}>
					{helpers.createIcon("\ue01b")}
				</MaterialUI.Icon>
				<MaterialUI.Typography>
					Phase deadline{" "}
					{helpers.minutesToDuration(
						this.props.game.Properties.PhaseLengthMinutes
					)}
				</MaterialUI.Typography>
			</div>
		);
		if (!this.props.game.Properties.SkipMuster) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue925")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Mustering before start
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.props.game.Properties.NonMovementPhaseLengthMinutes) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue01b")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Non movement phase deadline{" "}
						{helpers.minutesToDuration(
							this.props.game.Properties
								.NonMovementPhaseLengthMinutes
						)}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.props.game.Properties.LastYear) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue88b")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Ends after year: {this.props.game.Properties.LastYear}
					</MaterialUI.Typography>
				</div>
			);
		}
		cells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
				key={cells.length}
			>
				<MaterialUI.Icon style={{ marginRight: "8px" }}>
					<MaterialUI.SvgIcon>
						<g
							id="Artboard"
							stroke="none"
							strokeWidth="1"
							fill="none"
							fillRule="evenodd"
						>
							<g id="timelapse-24px">
								<polygon
									id="Path"
									points="0 0 24 0 24 24 0 24"
								></polygon>
								<path
									d="M12,6 C12.5719312,6 13.1251722,6.08002251 13.6491373,6.22948186 L12,12 Z M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M12,20 C7.58,20 4,16.42 4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 Z"
									id="Shape"
									fill="#000000"
									fillRule="nonzero"
								></path>
							</g>
						</g>
					</MaterialUI.SvgIcon>
				</MaterialUI.Icon>
				<MaterialUI.Typography>
					Created:{" "}
					{helpers.timeStrToDate(
						this.props.game.Properties.CreatedAt
					)}{" "}
				</MaterialUI.Typography>
			</div>
		);
		if (this.props.game.Properties.Started) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue422")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Started:{" "}
						{helpers.timeStrToDate(
							this.props.game.Properties.StartedAt
						)}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.props.game.Properties.Finished) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						<MaterialUI.SvgIcon>
							<g
								id="Artboard"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g id="timelapse-24px">
									<polygon
										id="Path"
										points="0 0 24 0 24 24 0 24"
									></polygon>
									<path
										d="M12,6 C15.3137085,6 18,8.6862915 18,12 C18,15.3137085 15.3137085,18 12,18 C8.6862915,18 6,15.3137085 6,12 C6,9.25822274 7.83903025,6.94597402 10.3508627,6.22948186 L12,12 Z M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M12,20 C7.58,20 4,16.42 4,12 C4,7.58 7.58,4 12,4 C16.42,4 20,7.58 20,12 C20,16.42 16.42,20 12,20 Z"
										id="Shape"
										fill="#000000"
										fillRule="nonzero"
									></path>
								</g>
							</g>
						</MaterialUI.SvgIcon>
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Finished:{" "}
						{helpers.timeStrToDate(
							this.props.game.Properties.FinishedAt
						)}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		cells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
				key={cells.length}
			>
				{this.props.game.Properties.NationAllocation == 1 ? (
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue065")}
					</MaterialUI.Icon>
				) : (
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						<MaterialUI.SvgIcon>
							<g
								id="Artboard"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g id="playlist_add_check-24px-(1)">
									<rect
										id="Rectangle"
										x="0"
										y="0"
										width="24"
										height="24"
									></rect>
									<path
										d="M14,10 L2,10 L2,12 L14,12 L14,10 Z M14,6 L2,6 L2,8 L14,8 L14,6 Z M18.51,16.25 L21,18.75 L18.51,21.25 L18.51,19.5 L13,19.5 L13,18 L18.51,18 L18.51,16.25 Z M15.49,12 L15.49,13.75 L21,13.75 L21,15.25 L15.49,15.25 L15.49,17 L13,14.5 L15.49,12 Z M10,14 L10,16 L2,16 L2,14 L10,14 Z"
										id="Shape"
										fill="#000000"
										fillRule="nonzero"
									></path>
								</g>
								<g id="loop-24px">
									<polygon
										id="Path"
										points="13 12 26 12 26 25 13 25"
									></polygon>
									<g id="transfer_within_a_station-24px">
										<polygon
											id="Path"
											points="0 0 24 0 24 24 0 24"
										></polygon>
									</g>
								</g>
							</g>
						</MaterialUI.SvgIcon>
					</MaterialUI.Icon>
				)}

				<MaterialUI.Typography>
					Nation selection:{" "}
					{this.props.game.Properties.NationAllocation == 1
						? "Preferences"
						: "Random"}{" "}
				</MaterialUI.Typography>
			</div>
		);

		if (this.props.game.Properties.MinRating) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue83a")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Minimum rating: {this.props.game.Properties.MinRating}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.props.game.Properties.MaxRating) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue83a")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Maximum rating: {this.props.game.Properties.MaxRating}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.props.game.Properties.MinReliability) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue425")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Minimum reliability:{" "}
						{this.props.game.Properties.MinReliability}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.props.game.Properties.MinQuickness) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						{helpers.createIcon("\ue425")}
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Minimum quickness:{" "}
						{this.props.game.Properties.MinQuickness}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.props.game.Properties.MaxHated) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						<MaterialUI.SvgIcon>
							<g
								id="Artboard"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g
									id="emoticon-angry-outline"
									transform="translate(1.000000, 1.000000)"
									fill="#000000"
									fillRule="nonzero"
								>
									<path
										d="M1.05,0.08 L13.4993434,12.5296465 L13.509,12.519 L13.9296465,12.939697 L12.939697,13.9296465 L11.4291042,12.4206404 C10.184652,13.4375261 8.62132228,14 7,14 C5.14348457,14 3.36300718,13.2625021 2.05025253,11.9497475 C0.737497883,10.6369928 0,8.85651543 0,7 C0,5.31921341 0.592383418,3.77678538 1.57975754,2.57010863 L0.0703535444,1.06030304 L1.05,0.08 Z M2.5761358,3.566003 C1.83897141,4.51428911 1.4,5.70588092 1.4,7 C1.4,10.0927946 3.9072054,12.6 7,12.6 C8.29411908,12.6 9.48571089,12.1610286 10.433997,11.4238642 L9.305,10.295 L8.939,10.661 C8.624,10.15 7.875,9.8 7,9.8 C6.125,9.8 5.376,10.15 5.061,10.661 L4.067,9.667 C4.697,8.904 5.775,8.4 7,8.4 C7.14658996,8.4 7.29107491,8.40721717 7.43293907,8.42123168 L5.12607623,6.1169691 C4.95837689,6.23170489 4.75906667,6.3 4.55,6.3 C3.99,6.3 3.5,5.81 3.5,5.25 L3.5,4.49 L2.5761358,3.566003 Z M7,0 C8.85651543,0 10.6369928,0.737497883 11.9497475,2.05025253 C13.2625021,3.36300718 14,5.14348457 14,7 C14,8.14229525 13.7207968,9.25580388 13.2001824,10.2492879 L12.1507771,9.20127306 C12.4399256,8.52556954 12.6,7.78147846 12.6,7 C12.6,5.51478766 12.0100017,4.09040574 10.959798,3.04020203 C9.90959426,1.98999831 8.48521234,1.4 7,1.4 C6.21813639,1.4 5.47369701,1.56023219 4.79772792,1.84965051 L3.74828763,0.799495095 C4.71989309,0.288908589 5.82620744,0 7,0 Z M10.5,4.2 L10.5,5.25 C10.5,5.81 10.01,6.3 9.45,6.3 C8.89,6.3 8.4,5.81 8.4,5.25 L10.5,4.2 Z"
										id="Combined-Shape"
									></path>
								</g>
							</g>
						</MaterialUI.SvgIcon>
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Maximum hated:
						{this.props.game.Properties.MaxHated}{" "}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (this.props.game.Properties.MaxHater) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MaterialUI.Icon style={{ marginRight: "8px" }}>
						<MaterialUI.SvgIcon>
							<g
								id="Artboard"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g
									id="emoticon-angry-outline"
									transform="translate(1.000000, 1.000000)"
									fill="#000000"
									fillRule="nonzero"
								>
									<path
										d="M1.05,0.08 L13.4993434,12.5296465 L13.509,12.519 L13.9296465,12.939697 L12.939697,13.9296465 L11.4291042,12.4206404 C10.184652,13.4375261 8.62132228,14 7,14 C5.14348457,14 3.36300718,13.2625021 2.05025253,11.9497475 C0.737497883,10.6369928 0,8.85651543 0,7 C0,5.31921341 0.592383418,3.77678538 1.57975754,2.57010863 L0.0703535444,1.06030304 L1.05,0.08 Z M2.5761358,3.566003 C1.83897141,4.51428911 1.4,5.70588092 1.4,7 C1.4,10.0927946 3.9072054,12.6 7,12.6 C8.29411908,12.6 9.48571089,12.1610286 10.433997,11.4238642 L9.305,10.295 L8.939,10.661 C8.624,10.15 7.875,9.8 7,9.8 C6.125,9.8 5.376,10.15 5.061,10.661 L4.067,9.667 C4.697,8.904 5.775,8.4 7,8.4 C7.14658996,8.4 7.29107491,8.40721717 7.43293907,8.42123168 L5.12607623,6.1169691 C4.95837689,6.23170489 4.75906667,6.3 4.55,6.3 C3.99,6.3 3.5,5.81 3.5,5.25 L3.5,4.49 L2.5761358,3.566003 Z M7,0 C8.85651543,0 10.6369928,0.737497883 11.9497475,2.05025253 C13.2625021,3.36300718 14,5.14348457 14,7 C14,8.14229525 13.7207968,9.25580388 13.2001824,10.2492879 L12.1507771,9.20127306 C12.4399256,8.52556954 12.6,7.78147846 12.6,7 C12.6,5.51478766 12.0100017,4.09040574 10.959798,3.04020203 C9.90959426,1.98999831 8.48521234,1.4 7,1.4 C6.21813639,1.4 5.47369701,1.56023219 4.79772792,1.84965051 L3.74828763,0.799495095 C4.71989309,0.288908589 5.82620744,0 7,0 Z M10.5,4.2 L10.5,5.25 C10.5,5.81 10.01,6.3 9.45,6.3 C8.89,6.3 8.4,5.81 8.4,5.25 L10.5,4.2 Z"
										id="Combined-Shape"
									></path>
								</g>
							</g>
						</MaterialUI.SvgIcon>
					</MaterialUI.Icon>
					<MaterialUI.Typography>
						Maximum hater: {this.props.game.Properties.MaxHater}
					</MaterialUI.Typography>
				</div>
			);
		}
		if (
			this.props.game.Properties.DisableConferenceChat ||
			this.props.game.Properties.DisableGroupChat ||
			this.props.game.Properties.DisablePrivateChat
		) {
			if (
				this.props.game.Properties.DisableConferenceChat &&
				this.props.game.Properties.DisableGroupChat &&
				this.props.game.Properties.DisablePrivateChat
			) {
				// Add two columns because this is required for formatting nicely.
				cells.push(
					<div
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
						}}
						key={cells.length}
					>
						<MaterialUI.Icon style={{ marginRight: "8px" }}>
							<MaterialUI.SvgIcon>
								<g
									id="Artboard"
									stroke="none"
									strokeWidth="1"
									fill="none"
									fillRule="evenodd"
								>
									<g id="message-24px">
										<polygon
											id="Path"
											points="0 0 24 0 24 24 0 24"
										></polygon>
										<path
											d="M2.4,2.614 L20.5847763,20.7989899 L20.598,20.784 L20.7989899,20.9842712 L19.3847763,22.3984848 L14.986,18 L6,18 L2,22 L2.008,5.022 L1,4.0137085 L2.4,2.614 Z M20,2 C21.05,2 21.9177686,2.82004132 21.9944872,3.85130541 L22,4 L22,16 C22,16.9134058 21.3794387,17.6889091 20.539101,17.925725 L16.614,14 L18,14 L18,12 L14.614,12 L13.614,11 L18,11 L18,9 L11.614,9 L10.614,8 L18,8 L18,6 L8.614,6 L4.614,2 L20,2 Z M8.987,12 L6,12 L6,14 L10.986,14 L8.987,12 Z M6,9.013 L6,11 L7.987,11 L6,9.013 Z"
											id="Combined-Shape"
											fill="#000000"
											fillRule="nonzero"
										></path>
									</g>
								</g>
							</MaterialUI.SvgIcon>
						</MaterialUI.Icon>
						<MaterialUI.Typography>
							No chat (Gunboat)
						</MaterialUI.Typography>
					</div>
				);
			} else {
				// Sort channel types by whether they're enabled or disabled.
				let allChannels = { false: [], true: [] };
				allChannels[
					this.props.game.Properties.DisableConferenceChat
				].push("Conference");
				allChannels[this.props.game.Properties.DisableGroupChat].push(
					"Group"
				);
				allChannels[this.props.game.Properties.DisablePrivateChat].push(
					"Private"
				);
				cells.push(
					<div
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
						}}
						key={cells.length}
					>
						<MaterialUI.Icon style={{ marginRight: "8px" }}>
							<MaterialUI.SvgIcon>
								<g
									id="Artboard"
									stroke="none"
									strokeWidth="1"
									fill="none"
									fillRule="evenodd"
								>
									<g id="message-24px">
										<polygon
											id="Path"
											points="0 0 24 0 24 24 0 24"
										></polygon>
										<path
											d="M2.4,2.614 L20.5847763,20.7989899 L20.598,20.784 L20.7989899,20.9842712 L19.3847763,22.3984848 L14.986,18 L6,18 L2,22 L2.008,5.022 L1,4.0137085 L2.4,2.614 Z M20,2 C21.05,2 21.9177686,2.82004132 21.9944872,3.85130541 L22,4 L22,16 C22,16.9134058 21.3794387,17.6889091 20.539101,17.925725 L16.614,14 L18,14 L18,12 L14.614,12 L13.614,11 L18,11 L18,9 L11.614,9 L10.614,8 L18,8 L18,6 L8.614,6 L4.614,2 L20,2 Z M8.987,12 L6,12 L6,14 L10.986,14 L8.987,12 Z M6,9.013 L6,11 L7.987,11 L6,9.013 Z"
											id="Combined-Shape"
											fill="#000000"
											fillRule="nonzero"
										></path>
									</g>
								</g>
							</MaterialUI.SvgIcon>
						</MaterialUI.Icon>
						<MaterialUI.Typography>
							{" "}
							{allChannels[false].join(" & ")} chat off
						</MaterialUI.Typography>
					</div>
				);
				cells.push(
					<div
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
						}}
						key={cells.length}
					>
						<MaterialUI.Icon style={{ marginRight: "8px" }}>
							{helpers.createIcon("\ue0c9")}
						</MaterialUI.Icon>
						<MaterialUI.Typography>
							{" "}
							{allChannels[true].join(" & ")} chat on{" "}
						</MaterialUI.Typography>
					</div>
				);
			}
		}
		if (!this.props.noplayerlist) {
			let playerList = [];
			playerList.push(
				<MaterialUI.Typography
					variant="subtitle2"
					style={{ color: "rgba(40, 26, 26, 0.7)", marginTop: "4px" }}
					key={playerList.length}
				>
					Players:
				</MaterialUI.Typography>
			);

			this.props.game.Properties.Members.forEach((member) => {
				playerList.push(
					<div
						key={playerList.length}
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "4px",
						}}
					>
						<UserAvatar user={member.User} />
						<MaterialUI.Typography>
							{member.User.GivenName} {member.User.FamilyName}
						</MaterialUI.Typography>
					</div>
				);
			});

			cells.push(
				<div
					style={{
						width: "100%",
						maxWidth: "460px",
					}}
					key={cells.length}
				>
					{playerList}
				</div>
			);
		}

		return cells;
	}
}
