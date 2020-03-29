export function timeStrToDate(s) {
	return new Date(Date.parse(s)).toLocaleDateString();
}

export function urlMatch(mappings, def) {
	for (let i = 0; i < mappings.length; i++) {
		let match = mappings[i][0].exec(Globals.selfURL.pathname);
		if (match) {
			if (mappings[i][1]) {
				mappings[i][1](match);
			}
			return;
		}
	}
	if (def) {
		def();
	}
}

export function phaseName(phase) {
	return (
		phase.Properties.Season +
		" " +
		phase.Properties.Year +
		", " +
		phase.Properties.Type
	);
}

export function timeStrToDateTime(s) {
	let d = new Date(Date.parse(s));
	return d.toLocaleTimeString() + " " + d.toLocaleDateString();
}

export function safeFetch(req) {
	return fetch(req).then(resp => {
		if (resp.status == 401) {
			localStorage.removeItem("token");
			location.replace("/");
			return Promise.resolve({});
		} else {
			return Promise.resolve(resp);
		}
	});
}

export function memoize(key, promiseFunc) {
	if (Globals.memoizeCache[key]) {
		return Promise.resolve(Globals.memoizeCache[key]);
	} else {
		return promiseFunc().then(result => {
			Globals.memoizeCache[key] = result;
			return Promise.resolve(result);
		});
	}
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

export function createIcon(codepoint, style = {}) {
	return (
		<i key={codepoint} style={style} className="material-icons">
			{codepoint}
		</i>
	);
}

function hideShowProgress() {
	Globals.progressDialog.setState({ open: Globals.progressCount > 0 });
}

export function incProgress() {
	Globals.progressCount++;
	hideShowProgress();
}

export function decProgress() {
	Globals.progressCount--;
	hideShowProgress();
}

export function createRequest(item, opts = {}) {
	let reqURL = new URL(item, Globals.serverRequest.url);
	let headers = Globals.serverRequest.headers;
	if (opts.headers) {
		for (let key in opts.headers) {
			headers.set(key, opts.headers[key]);
		}
	}
	if (opts.params) {
		for (let key in opts.params) {
			reqURL.searchParams.set(key, opts.params[key]);
		}
	}
	let req = new Request(reqURL.toString(), {
		method: opts.method || Globals.serverRequest.method,
		mode: opts.mode || Globals.serverRequest.mode,
		headers: headers,
		body: opts.body
	});
	if (opts.unauthed) {
		req.headers.delete("Authorization");
	}
	return req;
}

export function minutesToDuration(m, short = false) {
	let reduce = null;
	reduce = m => {
		if (m < 60) {
			return "" + Number.parseInt(m) + "m";
		} else if (m < 60 * 24) {
			let h = Number.parseInt(m / 60);
			let remainder = m - h * 60;
			let rval = "" + h + "h";
			if (remainder == 0 || short) {
				return rval;
			}
			return rval + " " + reduce(remainder);
		} else if (m < 60 * 24 * 7) {
			let d = Number.parseInt(m / (60 * 24));
			let remainder = m - d * 60 * 24;
			let rval = "" + d + "d";
			if (remainder == 0 || short) {
				return rval;
			}
			return rval + " " + reduce(remainder);
		} else {
			let w = Number.parseInt(m / (60 * 24 * 7));
			let remainder = m - w * 60 * 24 * 7;
			let rval = "" + w + "w";
			if (remainder == 0 || short) {
				return rval;
			}
			return rval + " " + reduce(remainder);
		}
	};
	return reduce(m);
}
