import React from "react";
import { Icon, IconButton, Typography, SvgIcon } from "@mui/material";
import {
	PhaseDeadlineIcon,
	KickIcon,
	ChatIcon,
	GavelIcon,
	PrivateGameIcon,
	GameVariantIcon,
	EndsAfterThisYearIcon,
	MusteringIcon,
	NationAllocationIcon,
	RatingIcon,
	StartedAtIcon,
	ReliabilityIcon,
	WhitelistIcon,
} from "../icons";
import gtag from "ga-gtag";
import AnonymousSvgPath from "../static/img/anon.svg";

import * as helpers from "../helpers";
import UserAvatar from "./OldUserAvatar";

export default class GameMetadata extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			game: this.props.game,
		};
		this.onKick = this.onKick.bind(this);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			JSON.stringify(prevProps.game) !== JSON.stringify(this.props.game)
		) {
			this.setState({ game: this.props.game });
		}
	}
	onKick(uid) {
		return (_) => {
			if (!uid) return;
			const link = this.state.game.Links.find((l) => {
				return l.Rel === "kick-" + uid;
			});
			if (!link) return;
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(link.URL, {
						method: link.Method,
					})
				)
				.then((_) => {
					helpers.decProgress();
					gtag("event", "game_metadata_kick_user");
					this.props.reloadGame().then((game) => {
						this.setState({ game: game });
					});
				});
		};
	}
	render() {
		let cells = [];
		if (this.state.game.Properties.ChatLanguageISO639_1) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<span
						style={{
							marginRight: "8px",
							width: "24px",
							height: "24px",
						}}
					>
						<div
							style={{
								fontFamily: "cabin",
								height: "24px",
								width: "24px",
								display: "inline-flex",
								alignSelf: "flex-start",
								backgroundImage:
									'url(\'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24" viewBox="0 0 24 24"><path fill="%23000000" d="M 20 2 H 4 c -1.1 0 -2 0.9 -2 2 v 18 l 4 -4 h 14 c 1.1 0 2 -0.9 2 -2 V 4 c 0 -1.1 -0.9 -2 -2 -2 Z"></path></svg>\')',
							}}
						>
							<div
								style={{
									fontSize: "12px",
									color: "#FFF",
									marginTop: "1px",
									textAlign: "center",
									width: "24px",
								}}
							>
								{
									this.state.game.Properties
										.ChatLanguageISO639_1
								}{" "}
								aaa
							</div>
						</div>
					</span>
					<Typography>
						Chat language:{" "}
						{
							helpers.iso639_1Codes.find((el) => {
								return (
									el.code ===
									this.state.game.Properties
										.ChatLanguageISO639_1
								);
							}).name
						}
					</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.Private) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<PrivateGameIcon style={{ marginRight: "8px" }} />
					<Typography>Private game</Typography>
				</div>
			);
		}
		if (this.props.game.Properties.GameMasterEnabled) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<GavelIcon style={{ marginRight: "8px" }} />
					<Typography>Managed by Game Master</Typography>
				</div>
			);
		}
		if (
			this.state.game.Properties.Private &&
			this.state.game.Properties.GameMasterEnabled &&
			this.state.game.Properties.RequireGameMasterInvitation
		) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<WhitelistIcon style={{ marginRight: "8px" }} />
					<Typography>Whitelist only (set by Game Master)</Typography>
				</div>
			);
		}
		cells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
				key={cells.length}
			>
				<GameVariantIcon style={{ marginRight: "8px" }} />
				<Typography>
					Game variant: {this.state.game.Properties.Variant}
				</Typography>
			</div>
		);
		cells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
				key={cells.length}
			>
				<PhaseDeadlineIcon style={{ marginRight: "8px" }} />
				<Typography>
					Phase deadline{" "}
					{helpers.minutesToDuration(
						this.state.game.Properties.PhaseLengthMinutes
					)}
				</Typography>
			</div>
		);
		if (!this.state.game.Properties.SkipMuster) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<MusteringIcon style={{ marginRight: "8px" }} />
					<Typography>Mustering before start</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.NonMovementPhaseLengthMinutes) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<PhaseDeadlineIcon style={{ marginRight: "8px" }} />
					<Typography>
						Non movement phase deadline{" "}
						{helpers.minutesToDuration(
							this.state.game.Properties
								.NonMovementPhaseLengthMinutes
						)}
					</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.LastYear) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<EndsAfterThisYearIcon style={{ marginRight: "8px" }} />
					<Typography>
						Ends after year: {this.state.game.Properties.LastYear}
					</Typography>
				</div>
			);
		}
		cells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
				key={cells.length}
			>
				<Icon style={{ marginRight: "8px" }}>
					<SvgIcon>
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
					</SvgIcon>
				</Icon>
				<Typography>
					Created:{" "}
					{helpers.timeStrToDate(
						this.state.game.Properties.CreatedAt
					)}{" "}
				</Typography>
			</div>
		);
		if (this.state.game.Properties.Started) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<StartedAtIcon style={{ marginRight: "8px" }} />
					<Typography>
						Started:{" "}
						{helpers.timeStrToDate(
							this.state.game.Properties.StartedAt
						)}
					</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.Finished) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<Icon style={{ marginRight: "8px" }}>
						<SvgIcon>
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
						</SvgIcon>
					</Icon>
					<Typography>
						Finished:{" "}
						{helpers.timeStrToDate(
							this.state.game.Properties.FinishedAt
						)}{" "}
					</Typography>
				</div>
			);
		}
		cells.push(
			<div
				style={{ width: "100%", display: "flex", alignItems: "center" }}
				key={cells.length}
			>
				{this.state.game.Properties.NationAllocation === 1 ? (
					<NationAllocationIcon style={{ marginRight: "8px" }} />
				) : (
					<Icon style={{ marginRight: "8px" }}>
						<SvgIcon>
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
						</SvgIcon>
					</Icon>
				)}

				<Typography>
					Nation selection:{" "}
					{this.state.game.Properties.NationAllocation === 1
						? "Preferences"
						: "Random"}{" "}
				</Typography>
			</div>
		);

		if (this.state.game.Properties.MinRating) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<RatingIcon style={{ marginRight: "8px" }} />
					<Typography>
						Minimum rating: {this.state.game.Properties.MinRating}{" "}
					</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MaxRating) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<RatingIcon style={{ marginRight: "8px" }} />
					<Typography>
						Maximum rating: {this.state.game.Properties.MaxRating}{" "}
					</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MinReliability) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<ReliabilityIcon style={{ marginRight: "8px" }} />
					<Typography>
						Minimum reliability:{" "}
						{this.state.game.Properties.MinReliability}{" "}
					</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MinQuickness) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<ReliabilityIcon style={{ marginRight: "8px" }} />
					<Typography>
						Minimum quickness:{" "}
						{this.state.game.Properties.MinQuickness}{" "}
					</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MaxHated) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<Icon style={{ marginRight: "8px" }}>
						<SvgIcon>
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
						</SvgIcon>
					</Icon>
					<Typography>
						Maximum hated:
						{this.state.game.Properties.MaxHated}{" "}
					</Typography>
				</div>
			);
		}
		if (this.state.game.Properties.MaxHater) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<Icon style={{ marginRight: "8px" }}>
						<SvgIcon>
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
						</SvgIcon>
					</Icon>
					<Typography>
						Maximum hater: {this.state.game.Properties.MaxHater}
					</Typography>
				</div>
			);
		}


		if (
			(this.state.game.Properties.Private &&
				this.state.game.Properties.Anonymous) ||
			(!this.state.game.Properties.Private &&
				this.state.game.Properties.DisableConferenceChat &&
				this.state.game.Properties.DisableGroupChat &&
				this.state.game.Properties.DisablePrivateChat)
		) {
			cells.push(
				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
					}}
					key={cells.length}
				>
					<span
						style={{
							marginRight: "8px",
							width: "24px",
							height: "24px",
						}}
					>
						<Icon style={{ marginRight: "8px" }}>
							<img
								alt="Anonymous"
								width="24"
								height="24"
								src={AnonymousSvgPath}
							/>
						</Icon>
					</span>
					<Typography>Anonymous</Typography>
				</div>
			);
		}
		if (
			this.state.game.Properties.DisableConferenceChat ||
			this.state.game.Properties.DisableGroupChat ||
			this.state.game.Properties.DisablePrivateChat
		) {
			if (
				this.state.game.Properties.DisableConferenceChat &&
				this.state.game.Properties.DisableGroupChat &&
				this.state.game.Properties.DisablePrivateChat
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
						<Icon style={{ marginRight: "8px" }}>
							<SvgIcon>
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
							</SvgIcon>
						</Icon>
						<Typography>No chat (Gunboat)</Typography>
					</div>
				);
			} else {
				// Sort channel types by whether they're enabled or disabled.
				let allChannels = { false: [], true: [] };
				allChannels[
					this.state.game.Properties.DisableConferenceChat
				].push("Conference");
				allChannels[this.state.game.Properties.DisableGroupChat].push(
					"Group"
				);
				allChannels[this.state.game.Properties.DisablePrivateChat].push(
					"Individual"
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
						<Icon style={{ marginRight: "8px" }}>
							<SvgIcon>
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
							</SvgIcon>
						</Icon>
						<Typography>
							{" "}
							{allChannels[true].join(" & ")} chat off
						</Typography>
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
						<ChatIcon style={{ marginRight: "8px" }} />
						<Typography>
							{" "}
							{allChannels[false].join(" & ")} chat on{" "}
						</Typography>
					</div>
				);
			}
		}
		if (!this.props.noplayerlist) {
			let playerList = [];
			playerList.push(
				<Typography
					variant="subtitle2"
					style={{ color: "rgba(40, 26, 26, 0.7)", marginTop: "4px" }}
					key={playerList.length}
				>
					Players:
				</Typography>
			);

			(this.state.game.Properties.Members || []).forEach((member) => {
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
						<Typography>
							{member.User.GivenName} {member.User.FamilyName}
						</Typography>
						{this.props.withKickButtons ? (
							this.state.game.Links.find((link) => {
								return link.Rel === "kick-" + member.User.Id;
							}) ? (
								<IconButton
                                    onClick={this.onKick(member.User.Id)}
                                    style={{ margin: "0 0 0 auto" }}
                                    size="large">
									<KickIcon />
								</IconButton>
							) : (
								""
							)
						) : (
							""
						)}
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
