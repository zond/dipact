import NationAvatar from '%{ cb "/js/nation_avatar.js" }%';

export function timeStrToDate(s) {
	return new Date(Date.parse(s)).toLocaleDateString();
}

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
function murmurhash3_32_gc(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;

	while (i < bytes) {
		k1 =
			(key.charCodeAt(i) & 0xff) |
			((key.charCodeAt(++i) & 0xff) << 8) |
			((key.charCodeAt(++i) & 0xff) << 16) |
			((key.charCodeAt(++i) & 0xff) << 24);
		++i;

		k1 =
			((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) &
			0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 =
			((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) &
			0xffffffff;

		h1 ^= k1;
		h1 = (h1 << 13) | (h1 >>> 19);
		h1b =
			((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) &
			0xffffffff;
		h1 =
			(h1b & 0xffff) +
			0x6b64 +
			((((h1b >>> 16) + 0xe654) & 0xffff) << 16);
	}

	k1 = 0;

	switch (remainder) {
		case 3:
			k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2:
			k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1:
			k1 ^= key.charCodeAt(i) & 0xff;

			k1 =
				((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) &
				0xffffffff;
			k1 = (k1 << 15) | (k1 >>> 17);
			k1 =
				((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) &
				0xffffffff;
			h1 ^= k1;
	}

	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 =
		((h1 & 0xffff) * 0x85ebca6b +
			((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) &
		0xffffffff;
	h1 ^= h1 >>> 13;
	h1 =
		((h1 & 0xffff) * 0xc2b2ae35 +
			((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) &
		0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}

export function hash(s) {
	return murmurhash3_32_gc(s, 0);
}

export function scopedClass(style) {
	style = style
		.replace(/\s+/g, " ")
		.replace(/^\s*/g, "")
		.replace(/\s*$/g, "");
	let h = hash(style);
	if (!document.getElementById("scoped-style-" + h)) {
		let newStyle = document.createElement("style");
		newStyle.setAttribute("id", "scoped-style-" + h);
		newStyle.innerHTML = "\n" + ".scoped-class-" + h + " {" + style + "}\n";
		document.head.appendChild(newStyle);
	}
	return "scoped-class-" + h;
}

// From https://gist.github.com/w3core/e3d9b5b6d69a3ba8671cc84714cca8a4
export function brightnessByColor(color) {
	var color = "" + color,
		isHEX = color.indexOf("#") == 0,
		isRGB = color.indexOf("rgb") == 0;
	if (isHEX) {
		var m = color
			.substr(1)
			.match(color.length == 7 ? /(\S{2})/g : /(\S{1})/g);
		if (m)
			var r = parseInt(m[0], 16),
				g = parseInt(m[1], 16),
				b = parseInt(m[2], 16);
	}
	if (isRGB) {
		var m = color.match(/(\d+){3}/g);
		if (m)
			var r = m[0],
				g = m[1],
				b = m[2];
	}
	if (typeof r != "undefined") return (r * 299 + g * 587 + b * 114) / 1000;
}

export function urlMatch(mappings, def) {
	for (let i = 0; i < mappings.length; i++) {
		let hrefURL = new URL(window.location.href);
		let match = mappings[i][0].exec(hrefURL.pathname);
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

export function channelName(channel, variant) {
	if (!channel) {
		return "";
	}
	if (
		channel.Properties.Members.length == variant.Properties.Nations.length
	) {
		return (
			<MaterialUI.Avatar
				style={{ border: "none" }}
				className={avatarClass}
				key="Everyone"
				alt="Everyone"
				src="/static/img/un_logo.svg"
			/>
		);
	}
	return channel.Properties.Members.map(member => {
		return <NationAvatar key={member} variant={variant} nation={member} />;
	});
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

export const avatarClass = scopedClass(`
  border: 1px solid black;
  width: 36px !important;
  height: 36px !important;
  margin: 2px;
`);
