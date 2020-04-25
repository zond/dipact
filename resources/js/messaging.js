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

		// The service worker registration that handles the FCM messages.
		this.registration = null;
		// The callbacks that listen to FCM messages from Diplicity.
		this.subscribers = {};
		// "undefined" means "accept whatever the server says we should be, but try to enabled if the server knows nothing".
		this.targetState = "undefined";

		// Has been started, will never start again.
		this.started = false;
		// Has notification permission.
		this.hasPermission = "unknown";
		// Has an FCM token.
		this.hasToken = false;
		// Has uploaded the token to the server.
		this.tokenOnServer = false;
		// The token on the server is enabled.
		this.tokenEnabled = false;

		// Main component that renders pages when we need to do that.
		this.main = null;
		// The FCM token itself.
		this.token = null;
		// The ID of this device, so that we know if we have a token on the server or not.
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
		this.uploadToken = this.uploadToken.bind(this);
	}
	handleSWMessage(ev) {
		if (this.main && ev.data.clickedNotification) {
			this.main.renderPath(ev.data.clickedNotification.action);
		}
	}
	start() {
		if (!firebase.messaging.isSupported()) {
			helpers.snackbar(
				"Firebase messaging is not supported in your browser, push notifications for new phases and messages will not work. Turn on email notifications in the settings menu instead."
			);
			return Promise.resolve({});
		}
		return new Promise((res, rej) => {
			if (this.started) {
				res();
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
							this.hasPermission = "true";

							// Callback fired if Instance ID token is updated.
							this.messaging.onTokenRefresh(this.refreshToken);

							// Handle incoming messages. Called when:
							// - a message is received while the app has focus
							// - the user clicks on an app notification created by a service worker
							//   'messaging.setBackgroundMessageHandler' handler.
							this.messaging.onMessage(this.onMessage);

							// Get Instance ID token. Initially this makes a network call, once retrieved
							// subsequent calls to getToken will return from cache.
							this.refreshToken().then(res);
						})
						.catch(err => {
							this.hasPermission = "false";
							console.log(
								"Unable to get permission to notify:",
								err
							);
							helpers.snackbar(
								"No notification permission. You won't get new message or phase notifications."
							);
							res();
						});
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
	uploadToken() {
		return new Promise((res, rej) => {
			if (!Globals.userConfig.Properties.FCMTokens) {
				Globals.userConfig.Properties.FCMTokens = [];
			}
			let hrefURL = new URL(window.location.href);
			let wantedToken = {
				Value: this.token,
				// Only if we are explicitly asked to be disabled will be create new tokens that are disabled.
				Disabled: this.targetState == "disabled",
				Note: "Created via dipact configuration on " + new Date(),
				App: "dipact@" + this.deviceID,
				MessageConfig: {
					ClickActionTemplate:
						hrefURL.protocol +
						"//" +
						hrefURL.host +
						messageClickActionTemplate,
					DontSendNotification: true,
					DontSendData: false
				},
				PhaseConfig: {
					ClickActionTemplate:
						hrefURL.protocol +
						"//" +
						hrefURL.host +
						messageClickActionTemplate,
					DontSendNotification: true,
					DontSendData: false
				}
			};
			let foundToken = Globals.userConfig.Properties.FCMTokens.find(t => {
				return t.App == wantedToken.App;
			});
			let updateServer = false;
			if (!foundToken) {
				foundToken = wantedToken;
				Globals.userConfig.Properties.FCMTokens.push(foundToken);
				Globals.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = 60;
				updateServer = true;
			} else {
				// If we are explicitly asked to be enabled or disabled, we'll modify any found token to match.
				if (foundToken.Disabled && this.targetState == "enabled") {
					foundToken.Disabled = false;
					updateServer = true;
				} else if (
					!foundToken.Disabled &&
					this.targetState == "disabled"
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
				let updateLink = Globals.userConfig.Links.find(l => {
					return l.Rel == "update";
				});
				return helpers
					.safeFetch(
						helpers.createRequest(updateLink.URL, {
							method: updateLink.Method,
							body: JSON.stringify(Globals.userConfig.Properties),
							headers: {
								"Content-Type": "application/json"
							}
						})
					)
					.then(resp => resp.json())
					.then(js => {
						Globals.userConfig = js;
						foundToken = js.Properties.FCMTokens.find(t => {
							return t.App == wantedToken.App;
						});
						if (foundToken.Disabled) {
							this.tokenEnabled = false;
							console.log(
								"Saved token on server to disable FCM push messages."
							);
						} else {
							this.tokenEnabled = true;
							console.log(
								"Saved token on server to enable FCM push messages."
							);
						}
						this.tokenOnServer = true;
						res(js);
					});
			} else {
				if (foundToken.Disabled) {
					this.tokenEnabled = false;
					console.log(
						"Token already saved  on server to disable FCM push messages."
					);
				} else {
					this.tokenEnabled = true;
					console.log(
						"Token already saved on  server to enable FCM push messages."
					);
				}
				this.tokenOnServer = true;
				res(Globals.userConfig);
			}
		});
	}
	refreshToken() {
		return new Promise((res, rej) => {
			this.messaging
				.getToken()
				.then(receivedToken => {
					this.token = receivedToken;
					this.hasToken = true;
					console.log("Got FCM token: " + receivedToken);
					this.uploadToken().then(res);
				})
				.catch(err => {
					console.log("Unable to retrieve FCM token:", err);
					res();
				});
		});
	}
	onMessage(payload) {
		payload = processNotification(payload, window.location.href);
		console.log("Message received in foreground: ", payload);
		let handled = false;
		if (this.subscribers[payload.data.type]) {
			for (let key in this.subscribers[payload.data.type]) {
				handled =
					handled ||
					this.subscribers[payload.data.type][key](payload);
			}
		}
		if (!handled) {
			this.registration.showNotification(payload.notification.title, {
				requireInteraction: true,
				body: payload.notification.body,
				icon: "https://diplicity-engine.appspot.com/img/otto.png",
				tag: payload.notification.click_action,
				renotify: true,
				actions: [
					{
						action: payload.notification.click_action,
						title: "View"
					}
				]
			});
		}
	}
}

const messaging = new Messaging();

export default messaging;
