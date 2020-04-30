function processNotification(payload, href) {
	payload.data = JSON.parse(
		pako.inflate(atob(payload.data.DiplicityJSON), { to: "string" })
	);
	const hrefURL = new URL(href);
	payload.notification = {};
	if (payload.data.type == "message") {
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
	} else if (payload.data.type == "phase") {
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
		payload.notification.body = payload.data.gameDesc + " has a new phase.";
	}
	return payload;
}
