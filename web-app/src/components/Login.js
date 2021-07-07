/* eslint-disable no-restricted-globals */
import React from 'react';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core'
import gtag from 'ga-gtag';
import { Typography } from '@material-ui/core';

import * as helpers from '../helpers';
import Globals from '../Globals';
import loginBackground from '../static/img/login_background.jpg'
import logo from '../static/img/logo.svg'
import googleIcon from '../static/img/google_icon.svg'

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stayLoggedIn: false,
		};
	}
	componentDidMount() {
		gtag("set", { page_title: "Login", page_location: location.href });
		gtag("event", "page_view");
	}
	render() {
		if (Globals.loginURL) {
			return (
				<div
					style={{
						background: `url("${loginBackground}") no-repeat bottom center fixed`,
						backgroundSize: 'cover',
						fontWeight: 400,
						fontFamily: '"Cabin", sans-serif',
						backgroundColor: '#fde2b5',
						margin: '0px',
						height: '100vh',
					}}
				>
					<div
						style={{
							alignContent: 'center',
       						maxWidth: '940px',
        					height: 'calc(100% - 2px)',
        					margin: 'auto',
						}}
					>
						<div
							className={helpers.scopedClass(`
								  display: flex;
								  align-items: flex-end;
								  align-content: flex-end;
								  justify-content: center;
								  flex-wrap:wrap;
								  height: calc(100% - 32px);
								  max-width: 340px;
								  padding: 16px;
								  `)}
						>
							<div>
								<img
									alt='Diplicity logo'
									className={helpers.scopedClass(`
									align-self: left;
									width: 100%;
									max-width: 340px;
									padding: 0px;
									margin: 0px;
									margin-bottom: 4px;
									`)}
									src={logo}
								/>
							</div>
							<div
								className={helpers.scopedClass(`
							  color: white;
							  font-family: cabin;
							  text-align: left;
							  width: 100%;
							  line-height: 1.4;
							  
							  `)}
							>
								<Typography>
									A digital version of the classic game of
									Diplomacy. Sign in to play.
								</Typography>
							</div>
							<div
								className={helpers.scopedClass(`
 				margin-top: 24px;
       			   `)}
							>
								<Button
									variant="contained"
									style={{
										backgroundColor: "white",
										color: "#757575",
										width: "220px",
										textTransform: "initial",
										fontFamily: '"cabin", sans-serif',
									}}
									onClick={(_) => {
										helpers.login(
											this.state.stayLoggedIn
												? 60 * 60 * 24 * 365 * 100
												: 60 * 60 * 20
										);
									}}
									startIcon={
										<i>
											<img
												alt='Google icon'
												src={googleIcon}
											/>{" "}
										</i>
									}
								>
									Sign in with Google
								</Button>
								{window.Wrapper ? (
									""
								) : (
									<FormControlLabel
										classes={{
											label: helpers.scopedClass(
												"color: white;"
											),
										}}
										control={
											<Checkbox
												style={{ color: "white" }}
												checked={
													this.state.stayLoggedIn
												}
												onChange={(ev) => {
													this.setState({
														stayLoggedIn:
															ev.target.checked,
													});
												}}
											/>
										}
										label="Stay logged in"
									/>
								)}
							</div>
							<div
								className={helpers.scopedClass(`
                margin:  24px calc(50% - 40px); visibility:hidden;
        
         `)}
							>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return "";
		}
	}
}
