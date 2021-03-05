import * as helpers from '%{ cb "/js/helpers.js" }%';

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
					className={helpers.scopedClass(`
								background: url("../static/img/login_background.jpg") no-repeat bottom center fixed;
        						background-size: cover;
        						font-weight: 400;
        						font-family: "Cabin", sans-serif;
        						background-color: #fde2b5;
        						margin: 0px;
        						`)}
				>
					<div
						className={helpers.scopedClass(`
						align-content: center;
       					max-width: 940px;
        				height: calc(100% - 2px);
        				margin: auto;
        				
						`)}
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
									className={helpers.scopedClass(`
									align-self: left;
									width: 100%;
									max-width: 340px;
									padding: 0px;
									margin: 0px;
									margin-bottom: 4px;
									`)}
									src="../static/img/logo.svg"
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
								A digital version of the classic game of
								Diplomacy. Sign in to play.
							</div>
							<div
								className={helpers.scopedClass(`
 				margin-top: 24px;
       			   `)}
							>
								<MaterialUI.Button
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
												src={
													"/static/img/google_icon.svg"
												}
											/>{" "}
										</i>
									}
								>
									Sign in with Google
								</MaterialUI.Button>
								{window.Wrapper ? (
									""
								) : (
									<MaterialUI.FormControlLabel
										classes={{
											label: helpers.scopedClass(
												"color: white;"
											),
										}}
										control={
											<MaterialUI.Checkbox
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
								<img src="../static/img/login_scrolldown.svg" />
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
