import * as helpers from '%{ cb "/js/helpers.js" }%';

const messageClickActionTemplate =
	"/Game/{{game.ID.Encode}}/Channel/{{#each channel.Members}}{{this}}{{#unless @last}},{{/unless}}{{/each}}/Messages";
const phaseClickActionTemplate =
	"/Game/{{game.ID.Encode}}/Channel/{{#each channel.Members}}{{this}}{{#unless @last}},{{/unless}}{{/each}}/Messages";

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
		this.registration = null;
		this.subscribers = {};
		this.started = false;
		this.main = null;
		this.token = null;
		this.deviceID = localStorage.getItem("deviceID");
		if (!this.deviceID) {
			this.deviceID = "" + new Date().getTime() + "_" + Math.random();
			localStorage.setItem("deviceID", this.deviceID);
		}

		this.refreshToken = this.refreshToken.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		this.handleSWMessage = this.handleSWMessage.bind(this);
		this.configure = this.configure.bind(this);
	}
	handleSWMessage(ev) {
		if (this.main && ev.data.clickedNotification) {
			this.main.renderPath(ev.data.clickedNotification.action);
		}
	}
	start() {
		if (this.started) {
			return;
		}
		this.started = true;
		navigator.serviceWorker
			.register("/static/js/firebase-messaging-sw.js")
			.then(registration => {
				navigator.serviceWorker.addEventListener(
					"message",
					this.handleSWMessage
				);
				this.registration = registration;
				this.messaging.useServiceWorker(this.registration);
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
						helpers.snackbar(
							"Unable to get notification permission, you won't get notifications for new messages or phases."
						);
					});
			});
	}
	subscribe(type, handler) {
		this.start();
		if (!this.subscribers[type]) {
			this.subscribers[type] = {};
		}
		let found = false;
		for (let key in this.subscribers[type]) {
			if (this.subscribers[type][key] == handler) {
				found = true;
				break;
			}
		}
		if (!found) {
			this.subscribers[type][
				Object.keys(this.subscribers[type]).length
			] = handler;
			return true;
		}
		return false;
	}
	unsubscribe(type, handler) {
		if (this.subscribers[type]) {
			for (let key in this.subscribers[type]) {
				if (this.subscribers[type][key] == handler) {
					delete this.subscribers[type][key];
					return true;
				}
			}
		}
		return false;
	}
	configure(enabled = "") {
		return helpers
			.safeFetch(Globals.serverRequest)
			.then(resp => resp.json())
			.then(rootJS => {
				let configLink = rootJS.Links.find(l => {
					return l.Rel == "user-config";
				});
				if (!configLink) {
					console.log(
						"Weirdness when trying to configure the user settings, can't find the config link in the root JS?"
					);
					return Promise.resolve({});
				}
				return helpers
					.safeFetch(helpers.createRequest(configLink.URL))
					.then(resp => resp.json())
					.then(js => {
						if (!js.Properties.FCMTokens) {
							js.Properties.FCMTokens = [];
						}
						let hrefURL = new URL(window.location.href);
						let wantedToken = {
							Value: this.token,
							Disabled: enabled == "false",
							Note:
								"Created via dipact configuration on " +
								new Date(),
							App: "dipact@" + this.deviceID,
							MessageConfig: {
								ClickActionTemplate:
									hrefURL.protocol +
									"//" +
									hrefURL.host +
									messageClickActionTemplate,
								DontSendNotification: false,
								DontSendData: false
							},
							PhaseConfig: {
								ClickActionTemplate:
									hrefURL.protocol +
									"//" +
									hrefURL.host +
									messageClickActionTemplate,
								DontSendNotification: false,
								DontSendData: false
							}
						};
						let foundToken = js.Properties.FCMTokens.find(t => {
							return t.App == wantedToken.App;
						});
						let updateServer = false;
						if (!foundToken) {
							foundToken = wantedToken;
							js.Properties.FCMTokens.push(foundToken);
							js.Properties.PhaseDeadlineWarningMinutesAhead = 60;
							updateServer = true;
						} else {
							if (foundToken.Disabled && enabled == "true") {
								foundToken.Disabled = false;
								updateServer = true;
							} else if (
								!foundToken.Disabled &&
								enabled == "false"
							) {
								foundToken.Disabled = true;
								updateServer = true;
							}
							if (foundToken.Value != this.token) {
								foundToken.Value = this.token;
								updateServer = true;
							}
							if (
								foundToken.MessageConfig.DontSendNotification !=
								wantedToken.MessageConfig.DontSendNotification
							) {
								foundToken.MessageConfig.DontSendNotification =
									wantedToken.MessageConfig.DontSendNotification;
								updateServer = true;
							}
							if (
								foundToken.PhaseConfig.DontSendNotification !=
								wantedToken.PhaseConfig.DontSendNotification
							) {
								foundToken.PhaseConfig.DontSendNotification =
									wantedToken.PhaseConfig.DontSendNotification;
								updateServer = true;
							}
							if (
								foundToken.MessageConfig.DontSendData !=
								wantedToken.MessageConfig.DontSendData
							) {
								foundToken.MessageConfig.DontSendData =
									wantedToken.MessageConfig.DontSendData;
								updateServer = true;
							}
							if (
								foundToken.PhaseConfig.DontSendData !=
								wantedToken.PhaseConfig.DontSendData
							) {
								foundToken.PhaseConfig.DontSendData =
									wantedToken.PhaseConfig.DontSendData;
								updateServer = true;
							}
							if (
								foundToken.MessageConfig.ClickActionTemplate !=
								wantedToken.MessageConfig.ClickActionTemplate
							) {
								foundToken.MessageConfig.ClickActionTemplate =
									wantedToken.MessageConfig.ClickActionTemplate;
								updateServer = true;
							}
							if (
								foundToken.PhaseConfig.ClickActionTemplate !=
								wantedToken.PhaseConfig.ClickActionTemplate
							) {
								foundToken.PhaseConfig.ClickActionTemplate =
									wantedToken.PhaseConfig.ClickActionTemplate;
								updateServer = true;
							}
						}
						if (updateServer) {
							let updateLink = js.Links.find(l => {
								return l.Rel == "update";
							});
							return helpers
								.safeFetch(
									helpers.createRequest(updateLink.URL, {
										method: updateLink.Method,
										body: JSON.stringify(js.Properties),
										headers: {
											"Content-Type": "application/json"
										}
									})
								)
								.then(resp => resp.json())
								.then(js => {
									if (foundToken.Disabled) {
										console.log(
											"Saved token on server to disable FCM push messages."
										);
									} else {
										console.log(
											"Saved token on server to enable FCM push messages."
										);
									}
									return Promise.resolve(js);
								});
						} else {
							if (foundToken.Disabled) {
								console.log(
									"Token already saved  on server to disable FCM push messages."
								);
							} else {
								console.log(
									"Token already saved on  server to enable FCM push messages."
								);
							}
							return Promise.resolve(js);
						}
					});
			});
	}
	refreshToken() {
		this.messaging
			.getToken()
			.then(receivedToken => {
				this.token = receivedToken;
				console.log("Got FCM token: " + receivedToken);
				this.configure();
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
		let handled = false;
		if (this.subscribers[payload.data.type]) {
			for (let key in this.subscribers[payload.data.type]) {
				handled =
					handled ||
					this.subscribers[payload.data.type][key](payload);
			}
		}
		if (!handled) {
			let actions = [
				{
					action: payload.notification.click_action,
					title: "View"
				}
			];
			this.registration.showNotification(payload.notification.title, {
				requireInteraction: true,
				body: payload.notification.body,
				icon: "https://diplicity-engine.appspot.com/img/otto.png",
				actions: actions
			});
		}
	}
}

const messaging = new Messaging();

export default messaging;
