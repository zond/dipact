/* eslint-disable no-restricted-globals */
import React from 'react';
import * as helpers from '../helpers';
import gtag from 'ga-gtag';
import {Divider, Typography, CircularProgress} from "@mui/material";

import GameListElement from './GameListElement';

export default class GameList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			games: this.props.predefinedList || [],
		};
		this.loadReq = this.loadReq.bind(this);
		this.loadPropsURL = this.loadPropsURL.bind(this);
		this.maybeLoadMore = this.maybeLoadMore.bind(this);
		this.reload = this.reload.bind(this);
		this.refresh = this.refresh.bind(this);
		this.loading = false;
		this.moreLink = null;
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
	}
	maybeLoadMore() {
		let scroller = document.getElementById("scroller");
		if (
			this.moreLink &&
			!this.loading &&
			scroller.scrollTop >
				scroller.scrollHeight - 2 * scroller.clientHeight
		) {
			const url = new URL(this.moreLink.URL);
			url.searchParams.set("limit", this.props.limit || 64);
			this.loadReq(helpers.createRequest(url), false);
		}
	}
	loadPropsURL() {
		this.props.url.searchParams.set("limit", this.props.limit || "64");
		this.loadReq(helpers.createRequest(this.props.url.toString()));
	}
	refresh() {
		this.loadPropsURL();
	}
	reload() {
		this.setState(
			{
				games: this.props.predefinedList || [
					{
						isProgress: true,
						Properties: { ID: "" + Math.random() },
					},
				],
			},
			this.loadPropsURL
		);
	}
	componentDidMount() {
		if (this.props.url) {
			this.reload();
			let scroller = document.getElementById("scroller");
			if (scroller) {
				scroller.addEventListener("scroll", this.maybeLoadMore);
			}
		}
		gtag("set", { page_title: "GameList", page_location: location.href });
		gtag("event", "page_view");
	}
	componentWillUnmount() {
		if (this.props.url) {
			let scroller = document.getElementById("scroller");
			if (scroller) {
				scroller.removeEventListener("scroll", this.maybeLoadMore);
			}
		}
	}
	loadReq(req, replace = true) {
		this.loading = true;
		helpers
			.safeFetch(req)
			.then((resp) => resp.json())
			.then((js) => {
				let games = js.Properties;
				if (!this.props.contained) {
					this.moreLink = js.Links.find((l) => {
						return l.Rel === "next";
					});
				}
				if (this.moreLink) {
					games.push({
						isProgress: true,
						Properties: { ID: "" + Math.random() },
					});
				}
				if (!replace) {
					games = this.state.games.slice(0, -1).concat(games);
				}
				this.setState(
					{
						games: games,
					},
					(_) => {
						this.loading = false;
						if (
							this.state.games.length > 0 &&
							this.props.onFilled
						) {
							this.props.onFilled();
						} else if (
							this.state.games.length === 0 &&
							this.props.onEmpty
						) {
							this.props.onEmpty();
						}
					}
				);
			});
	}
	renderElement(el) {
		if (el.isProgress) {
			return (
				<div
					key="progress"
					style={{
						width: "100%",
						textAlign: "center",
						paddingTop: "calc(50% - 20px)",
						paddingBottom: "calc(50% - 20px)",
					}}
				>
					<CircularProgress />
				</div>
			);
		} else {
			return (
				<GameListElement
					onPhaseMessage={this.props.onPhaseMessage}
					summaryOnly={
						this.props.contained && !this.props.withDetails
					}
					game={el}
					key={el.Properties.ID}
				/>
			);
		}
	}
	render() {
		if (this.props.contained) {
			return (
				<div style={{ width: "100%" }}>
					{this.state.games.map((game, idx) => {
						return (
							<React.Fragment
								key={
									game.Properties.ID +
									game.Properties.Started +
									game.Properties.Finished +
									(game.Properties.NewestPhaseMeta || [
										{ PhaseOrdinal: 0 },
									])[0].PhaseOrdinal
								}
							>
								{this.renderElement(game)}
								{idx < this.state.games.length - 1 ? (
									<Divider
										light
										style={{ marginTop: "8px" }}
									/>
								) : (
									""
								)}
							</React.Fragment>
						);
					})}
				</div>
			);
		} else {
			return (
				<div
					id="scroller"
					style={{
						maxWidth: "940px",
						margin: "auto",
						height: "calc(100% - 60px)",
						overflowY: "scroll",
						padding: "0px 16px",
					}}
				>
					<Typography
						variant="subtitle2"
						style={{
							color: "rgba(40, 26, 26, 0.56)",
							padding: "16px 0px",
						}}
					>
						{this.props.label ? this.props.label : ""}
					</Typography>
					{this.state.games.map((game, idx) => {
						return this.renderElement(game);
					})}
				</div>
			);
		}
	}
}

