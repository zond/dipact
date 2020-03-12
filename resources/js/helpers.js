import Globals from '%{ cb "./globals.js" }%';

export function createRequest(item, opts={}) {
	let req_url = new URL(Globals.server_request.url);
	try {
		let item_url = new URL(item);
		req_url.pathname = item_url.pathname;
	} catch (e) {
		req_url.pathname = item;
	}
	let req = new Request(req_url.toString(), {
		mode: Globals.server_request.mode,
		headers: Globals.server_request.headers,
	});
	if (opts.unauthed) {
		req.headers.delete('Authorization');
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
