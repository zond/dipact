export function timeStrToDate(s) {
	return new Date(Date.parse(s)).toLocaleDateString();
}

export function gameDesc(game) {
	let member = game.Properties.Members.find(member => {
		return member.User.Email == Globals.user.Email;
	});
	if (member && member.GameAlias) {
		return member.GameAlias;
	} else {
		return game.Properties.Desc;
	}
}

export const Transition = React.forwardRef(function Transition(props, ref) {
	return <MaterialUI.Slide direction="up" ref={ref} {...props} />;
});

export function createIcon(codepoint, style = {}) {
	return (
		<i key={codepoint} style={style} className="material-icons">
			{codepoint}
		</i>
	);
}

function hideShowProgress() {
	Globals.progress_dialog.setState({ open: Globals.progress_count > 0 });
}

export function incProgress() {
	Globals.progress_count++;
	hideShowProgress();
}

export function decProgress() {
	Globals.progress_count--;
	hideShowProgress();
}

export function createRequest(item, opts = {}) {
	let req_url = new URL(Globals.server_request.url);
	try {
		let item_url = new URL(item);
		req_url.pathname = item_url.pathname;
	} catch (e) {
		req_url.pathname = item;
	}
	let headers = Globals.server_request.headers;
	if (opts.headers) {
		for (let key in opts.headers) {
			headers.set(key, opts.headers[key]);
		}
	}
	let req = new Request(req_url.toString(), {
		method: opts.method || Globals.server_request.method,
		mode: opts.mode || Globals.server_request.mode,
		headers: headers,
		body: opts.body
	});
	if (opts.unauthed) {
		req.headers.delete("Authorization");
	}
	return req;
}

export function minutesToDuration(m) {
	let reduce = null;
	reduce = m => {
		if (m < 60) {
			return "" + m + "m";
		} else if (m < 60 * 24) {
			let h = m / 60;
			let remainder = m - h * 60;
			let rval = "" + h + "h";
			if (remainder == 0) {
				return rval;
			}
			return rval + " " + reduce(remainder);
		} else {
			let d = m / (60 * 24);
			let remainder = m - d * 60 * 24;
			let rval = "" + d + "d";
			if (remainder == 0) {
				return rval;
			}
			return rval + " " + reduce(remainder);
		}
	};
	return reduce(m);
}
