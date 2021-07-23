/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js");
importScripts(
	"https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js"
);
importScripts("https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.6/pako.min.js");

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

function processNotification(payload, href) {
	payload.data = JSON.parse(
		pako.inflate(atob(payload.data.DiplicityJSON), { to: "string" })
	);
	const hrefURL = new URL(href);
	payload.notification = {};
	if (payload.data.type === "message") {
		payload.notification.click_action =
			hrefURL.protocol +
			"//" +
			hrefURL.host +
			"/Game/" +
			payload.data.message.GameID +
			"/Channel/" +
			payload.data.message.ChannelMembers.join(",") +
			"/Messages";
		payload.notification.title =
			payload.data.message.Sender +
			" -> " +
			payload.data.message.ChannelMembers.join(", ");
		payload.notification.body = payload.data.message.Body;
	} else if (payload.data.type === "phase") {
		payload.notification.click_action =
			hrefURL.protocol +
			"//" +
			hrefURL.host +
			"/Game/" +
			payload.data.gameID;
		payload.notification.title =
			payload.data.gameDesc +
			": " +
			payload.data.phaseMeta.Season +
			" " +
			payload.data.phaseMeta.Year +
			", " +
			payload.data.phaseMeta.Type;
		payload.notification.body =
			payload.data.gameDesc +
			": " +
			payload.data.phaseMeta.Season +
			" " +
			payload.data.phaseMeta.Year +
			", " +
			payload.data.phaseMeta.Type +
			" has changed state";
	}
	return payload;
}

const messaging = firebase.messaging();

addEventListener("notificationclick", ev => {
	ev.waitUntil(
		clients.matchAll({
		  includeUncontrolled: true,
		  type: "window"
		}).then(foundClients => {
			if (foundClients.length > 0) {
				foundClients.forEach(client => {
					const message = {
						clickedNotification: {
							action: ev.notification.actions[0].action
						}
					};
					console.log("Sending", message, "to", client);
					client.postMessage(message);
					client.focus();
				});
			} else {
				console.log(
					"Found no client, opening new at",
					ev.notification.actions[0].action
				);
				clients.openWindow(ev.notification.actions[0].action);
			}
			ev.notification.close();
		})
	);
});

messaging.setBackgroundMessageHandler(payload => {
	payload = processNotification(payload, location.href);
	console.log("Message received in background: ", payload);
	registration.showNotification(payload.notification.title, {
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
});