import * as helpers from '%{ cb "/js/helpers.js" }%';

const messageClickActionTemplate = "https://dipact.appspot.com";

class Messaging {
	constructor() {
		let firebaseConfig = {
			apiKey: "AIzaSyDxQpMuCYlu95_oG7FUCLFIYIIfvKz-4D8",
			authDomain: "diplicity-engine.firebaseapp.com",
			databaseURL: "https://diplicity-engine.firebaseio.com",
			projectId: "diplicity-engine",
			storageBucket: "diplicity-engine.appspot.com",
			messagingSenderId: "635122585664",
			appId: "1:635122585664:web:f87b8d8bd9023019a74fa5"
		};
		firebase.initializeApp(firebaseConfig);

		this.messaging = firebase.messaging();
		this.subscribers = {};

		this.refreshToken = this.refreshToken.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.subscribe = this.subscribe.bind(this);

		this.messaging
			.requestPermission()
			.then(_ => {
				console.log("Notification permission granted.");
				// Get Instance ID token. Initially this makes a network call, once retrieved
				// subsequent calls to getToken will return from cache.
				this.refreshToken();

				// Callback fired if Instance ID token is updated.
				this.messaging.onTokenRefresh(this.refreshToken);

				// Handle incoming messages. Called when:
				// - a message is received while the app has focus
				// - the user clicks on an app notification created by a service worker
				//   'messaging.setBackgroundMessageHandler' handler.
				this.messaging.onMessage(this.onMessage);
			})
			.catch(err => {
				console.log("Unable to get permission to notify:", err);
			});
	}
	subscribe(type, handler) {
		this.subscribers[type] = handler;
	}
	refreshToken() {
		this.messaging
			.getToken()
			.then(token => {
				console.log("Got FCM token: " + token);
				helpers
					.safeFetch(Globals.serverRequest)
					.then(resp => resp.json())
					.then(rootJS => {
						let configLink = rootJS.Links.find(l => {
							return l.Rel == "user-config";
						});
						if (!configLink) {
							return;
						}
						helpers
							.safeFetch(helpers.createRequest(configLink.URL))
							.then(resp => resp.json())
							.then(js => {
								let dipactToken = js.Properties.FCMTokens.find(
									t => {
										return (
											t.App ==
											"dipact@" + helpers.selfURL.host
										);
									}
								);
								let updateServer = false;
								if (!dipactToken) {
									js.Properties.FCMTokens.push({
										Value: token,
										Disabled: false,
										Note:
											"Created via dipact refreshToken on " +
											new Date(),
										App: "dipact"
									});
									updateServer = true;
								} else if (dipactToken.Disabled) {
									dipactToken.Disabled = false;
									dipactToken.Value = token;
									dipactToken.Note =
										"Re-enabled via dipact refreshToken on " +
										new Date();
									updateServer = true;
								} else if (
									dipactToken.MessageConfig
										.ClickActionTemplate !=
									messageClickActionTemplate
								) {
									dipactToken.MessageConfig.ClickActionTemplate = messageClickActionTemplate;
									updateServer = true;
								}
								if (updateServer) {
									let updateLink = js.Links.find(l => {
										return l.Rel == "update";
									});
									helpers
										.safeFetch(
											helpers.createRequest(
												updateLink.URL,
												{
													method: updateLink.Method,
													body: JSON.stringify(
														js.Properties
													),
													headers: {
														"Content-Type":
															"application/json"
													}
												}
											)
										)
										.then(_ => {
											console.log(
												"Saved token on server to receive push messages."
											);
										});
								} else {
									console.log(
										"Token already saved on server, push messages enabled."
									);
								}
							});
					});
			})
			.catch(err => {
				console.log("Unable to retrieve FCM token:", err);
			});
	}
	onMessage(payload) {
		payload.data = JSON.parse(
			new TextDecoder("utf-8").decode(
				pako.inflate(
					Uint8Array.from(atob(payload.data.DiplicityJSON), c =>
						c.charCodeAt(0)
					)
				)
			)
		);
		console.log("Message received:", payload);
		if (
			!this.subscribers[payload.data.type] ||
			!this.subscribers[payload.data.type](payload)
		) {
			let notification = new Notification(payload.notification.title, {
				body: payload.notification.body,
				icon: helpers.createRequest("/favicon.ico").url
			});
			notification.onclick = ev => {
				ev.preventDefault();
				notification.close();
				window.open(payload.notification.click_action);
			};
		}
	}
}

const messaging = new Messaging();

export default messaging;
