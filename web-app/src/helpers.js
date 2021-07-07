/* eslint-disable no-restricted-globals */
import Globals from "./Globals";

export const overrideReg = /[^\w]/g;

const colorReg = /^#([0-9a-fA-F]{3,3}|[0-9a-fA-F]{6,6}|[0-9a-fA-F]{8,8})$/;
const linkReg = /^([^]*?)((mailto:|https?:\/\/)[^\s]*[^.\s])([^]*)$/m;

export const DiplicitySender = "Diplicity";

export function linkify(s) {
	const parts = [];
	let remainder = s;
	let match = linkReg.exec(s);
	while (match) {
		parts.push(match[1]);
		parts.push(
			<a key={match[2]} href={match[2]}>
				{match[2]}
			</a>
		);
		remainder = match[4];
		match = linkReg.exec(remainder);
	}
	parts.push(remainder);
	return parts;
}

export function ratingPercentile(rating) {
	let totalCount = 0;
	let belowCount = 0;
	Globals.userRatingHistogram.Properties.Counts.forEach((count, idx) => {
		totalCount += count;
		if (
			idx + Globals.userRatingHistogram.Properties.FirstBucketRating <
			rating
		) {
			belowCount += count;
		}
	});
	return Math.floor(100 - 100 * (belowCount / totalCount));
}

export function timeStrToDate(s) {
	return new Date(Date.parse(s)).toLocaleDateString();
}

function parseUserConfigColor(override) {
	const parts = override.split("/");
	if (parts.length === 1 && parts[0].match(colorReg)) {
		return {
			type: "position",
			value: parts[0],
		};
	} else if (parts.length === 2 && parts[1].match(colorReg)) {
		return {
			type: "nation",
			nation: Globals.colorOverrides.nationCodes[parts[0]],
			value: parts[1],
		};
	} else if (parts.length === 3 && parts[2].match(colorReg)) {
		return {
			type: "variant",
			variant: Globals.colorOverrides.variantCodes[parts[0]],
			nation: Globals.colorOverrides.nationCodes[parts[1]],
			value: parts[2],
		};
	}
}

export function parseUserConfigColors() {
	Globals.colorOverrides.positions = [];
	Globals.colorOverrides.variants = {};
	Globals.colorOverrides.nations = {};
	(Globals.userConfig.Properties.Colors || []).forEach((override) => {
		if (override !== "") {
			const parsed = parseUserConfigColor(override);
			if (parsed.type === "position") {
				Globals.colorOverrides.positions.push(parsed.value);
			} else if (parsed.type === "nation") {
				Globals.colorOverrides.nations[parsed.nation] = parsed.value;
			} else if (parsed.type === "variant") {
				if (!Globals.colorOverrides.variants[parsed.variant]) {
					Globals.colorOverrides.variants[parsed.variant] = {};
				}
				Globals.colorOverrides.variants[parsed.variant][parsed.nation] =
					parsed.value;
			}
		}
	});
}

export function snackbar(s, closesToIgnore = 0) {
	Globals.snackbar.setState({ message: s, closesToIgnore: closesToIgnore });
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
	var remainder, bytes, h1, h1b, c1, c2, k1, i;

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
			break;
		case 2:
			k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
			break;
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
			break;
		default:
			return;
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
		newStyle.innerHTML = "\n.scoped-class-" + h + " {" + style + "}\n";
		document.head.appendChild(newStyle);
	}
	return "scoped-class-" + h;
}

// From https://gist.github.com/w3core/e3d9b5b6d69a3ba8671cc84714cca8a4
export function brightnessByColor(color) {
	var isHEX = color.indexOf("#") === 0;
	if (isHEX) {
		var m = color
			.substr(1)
			.match(color.length === 7 ? /(\S{2})/g : /(\S{1})/g);
		if (m)
			var r = parseInt(m[0], 16),
				g = parseInt(m[1], 16),
				b = parseInt(m[2], 16);
	}
	if (typeof r !== "undefined") return (r * 299 + g * 587 + b * 114) / 1000;
}

export function urlMatch(mappings, def) {
	for (let i = 0; i < mappings.length; i++) {
		let hrefURL = new URL(location.href);
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

export function storeToken(token) {
	localStorage.setItem("token", token);
	Globals.serverRequest.headers.set("Authorization", "bearer " + token);
}

export function memoize(key, promiseFunc) {
	if (Globals.memoizeCache[key]) {
		return Promise.resolve(Globals.memoizeCache[key]);
	} else {
		return promiseFunc().then((result) => {
			Globals.memoizeCache[key] = result;
			return Promise.resolve(result);
		});
	}
}

export function gameDesc(game) {
	let member = (game.Properties.Members || []).find((member) => {
		return member.User.Email === Globals.user.Email;
	});
	if (member && member.GameAlias) {
		return member.GameAlias;
	} else {
		return game.Properties.Desc;
	}
}

export const iso639_1Codes = [
	{
		code: "ab",
		name: "Abkhaz",
	},
	{
		code: "aa",
		name: "Afar",
	},
	{
		code: "af",
		name: "Afrikaans",
	},
	{
		code: "ak",
		name: "Akan",
	},
	{
		code: "sq",
		name: "Albanian",
	},
	{
		code: "am",
		name: "Amharic",
	},
	{
		code: "ar",
		name: "Arabic",
	},
	{
		code: "an",
		name: "Aragonese",
	},
	{
		code: "hy",
		name: "Armenian",
	},
	{
		code: "as",
		name: "Assamese",
	},
	{
		code: "av",
		name: "Avaric",
	},
	{
		code: "ae",
		name: "Avestan",
	},
	{
		code: "ay",
		name: "Aymara",
	},
	{
		code: "az",
		name: "Azerbaijani",
	},
	{
		code: "bm",
		name: "Bambara",
	},
	{
		code: "ba",
		name: "Bashkir",
	},
	{
		code: "eu",
		name: "Basque",
	},
	{
		code: "be",
		name: "Belarusian",
	},
	{
		code: "bn",
		name: "Bengali; Bangla",
	},
	{
		code: "bh",
		name: "Bihari",
	},
	{
		code: "bi",
		name: "Bislama",
	},
	{
		code: "bs",
		name: "Bosnian",
	},
	{
		code: "br",
		name: "Breton",
	},
	{
		code: "bg",
		name: "Bulgarian",
	},
	{
		code: "my",
		name: "Burmese",
	},
	{
		code: "ca",
		name: "Catalan; Valencian",
	},
	{
		code: "ch",
		name: "Chamorro",
	},
	{
		code: "ce",
		name: "Chechen",
	},
	{
		code: "ny",
		name: "Chichewa; Chewa; Nyanja",
	},
	{
		code: "zh",
		name: "Chinese",
	},
	{
		code: "cv",
		name: "Chuvash",
	},
	{
		code: "kw",
		name: "Cornish",
	},
	{
		code: "co",
		name: "Corsican",
	},
	{
		code: "cr",
		name: "Cree",
	},
	{
		code: "hr",
		name: "Croatian",
	},
	{
		code: "cs",
		name: "Czech",
	},
	{
		code: "da",
		name: "Danish",
	},
	{
		code: "dv",
		name: "Divehi; Dhivehi; Maldivian;",
	},
	{
		code: "nl",
		name: "Dutch",
	},
	{
		code: "dz",
		name: "Dzongkha",
	},
	{
		code: "en",
		name: "English",
	},
	{
		code: "eo",
		name: "Esperanto",
	},
	{
		code: "et",
		name: "Estonian",
	},
	{
		code: "ee",
		name: "Ewe",
	},
	{
		code: "fo",
		name: "Faroese",
	},
	{
		code: "fj",
		name: "Fijian",
	},
	{
		code: "fi",
		name: "Finnish",
	},
	{
		code: "fr",
		name: "French",
	},
	{
		code: "ff",
		name: "Fula; Fulah; Pulaar; Pular",
	},
	{
		code: "gl",
		name: "Galician",
	},
	{
		code: "ka",
		name: "Georgian",
	},
	{
		code: "de",
		name: "German",
	},
	{
		code: "el",
		name: "Greek, Modern",
	},
	{
		code: "gn",
		name: "GuaranÃ­",
	},
	{
		code: "gu",
		name: "Gujarati",
	},
	{
		code: "ht",
		name: "Haitian; Haitian Creole",
	},
	{
		code: "ha",
		name: "Hausa",
	},
	{
		code: "he",
		name: "Hebrew (modern)",
	},
	{
		code: "hz",
		name: "Herero",
	},
	{
		code: "hi",
		name: "Hindi",
	},
	{
		code: "ho",
		name: "Hiri Motu",
	},
	{
		code: "hu",
		name: "Hungarian",
	},
	{
		code: "ia",
		name: "Interlingua",
	},
	{
		code: "id",
		name: "Indonesian",
	},
	{
		code: "ie",
		name: "Interlingue",
	},
	{
		code: "ga",
		name: "Irish",
	},
	{
		code: "ig",
		name: "Igbo",
	},
	{
		code: "ik",
		name: "Inupiaq",
	},
	{
		code: "io",
		name: "Ido",
	},
	{
		code: "is",
		name: "Icelandic",
	},
	{
		code: "it",
		name: "Italian",
	},
	{
		code: "iu",
		name: "Inuktitut",
	},
	{
		code: "ja",
		name: "Japanese",
	},
	{
		code: "jv",
		name: "Javanese",
	},
	{
		code: "kl",
		name: "Kalaallisut, Greenlandic",
	},
	{
		code: "kn",
		name: "Kannada",
	},
	{
		code: "kr",
		name: "Kanuri",
	},
	{
		code: "ks",
		name: "Kashmiri",
	},
	{
		code: "kk",
		name: "Kazakh",
	},
	{
		code: "km",
		name: "Khmer",
	},
	{
		code: "ki",
		name: "Kikuyu, Gikuyu",
	},
	{
		code: "rw",
		name: "Kinyarwanda",
	},
	{
		code: "ky",
		name: "Kyrgyz",
	},
	{
		code: "kv",
		name: "Komi",
	},
	{
		code: "kg",
		name: "Kongo",
	},
	{
		code: "ko",
		name: "Korean",
	},
	{
		code: "ku",
		name: "Kurdish",
	},
	{
		code: "kj",
		name: "Kwanyama, Kuanyama",
	},
	{
		code: "la",
		name: "Latin",
	},
	{
		code: "lb",
		name: "Luxembourgish, Letzeburgesch",
	},
	{
		code: "lg",
		name: "Ganda",
	},
	{
		code: "li",
		name: "Limburgish, Limburgan, Limburger",
	},
	{
		code: "ln",
		name: "Lingala",
	},
	{
		code: "lo",
		name: "Lao",
	},
	{
		code: "lt",
		name: "Lithuanian",
	},
	{
		code: "lu",
		name: "Luba-Katanga",
	},
	{
		code: "lv",
		name: "Latvian",
	},
	{
		code: "gv",
		name: "Manx",
	},
	{
		code: "mk",
		name: "Macedonian",
	},
	{
		code: "mg",
		name: "Malagasy",
	},
	{
		code: "ms",
		name: "Malay",
	},
	{
		code: "ml",
		name: "Malayalam",
	},
	{
		code: "mt",
		name: "Maltese",
	},
	{
		code: "mi",
		name: "MÄori",
	},
	{
		code: "mr",
		name: "Marathi (MarÄá¹­hÄ«)",
	},
	{
		code: "mh",
		name: "Marshallese",
	},
	{
		code: "mn",
		name: "Mongolian",
	},
	{
		code: "na",
		name: "Nauru",
	},
	{
		code: "nv",
		name: "Navajo, Navaho",
	},
	{
		code: "nb",
		name: "Norwegian BokmÃ¥l",
	},
	{
		code: "nd",
		name: "North Ndebele",
	},
	{
		code: "ne",
		name: "Nepali",
	},
	{
		code: "ng",
		name: "Ndonga",
	},
	{
		code: "nn",
		name: "Norwegian Nynorsk",
	},
	{
		code: "no",
		name: "Norwegian",
	},
	{
		code: "ii",
		name: "Nuosu",
	},
	{
		code: "nr",
		name: "South Ndebele",
	},
	{
		code: "oc",
		name: "Occitan",
	},
	{
		code: "oj",
		name: "Ojibwe, Ojibwa",
	},
	{
		code: "cu",
		name:
			"Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
	},
	{
		code: "om",
		name: "Oromo",
	},
	{
		code: "or",
		name: "Oriya",
	},
	{
		code: "os",
		name: "Ossetian, Ossetic",
	},
	{
		code: "pa",
		name: "Panjabi, Punjabi",
	},
	{
		code: "pi",
		name: "PÄli",
	},
	{
		code: "fa",
		name: "Persian (Farsi)",
	},
	{
		code: "pl",
		name: "Polish",
	},
	{
		code: "ps",
		name: "Pashto, Pushto",
	},
	{
		code: "pt",
		name: "Portuguese",
	},
	{
		code: "qu",
		name: "Quechua",
	},
	{
		code: "rm",
		name: "Romansh",
	},
	{
		code: "rn",
		name: "Kirundi",
	},
	{
		code: "ro",
		name: "Romanian, [])",
	},
	{
		code: "ru",
		name: "Russian",
	},
	{
		code: "sa",
		name: "Sanskrit (Saá¹ská¹›ta)",
	},
	{
		code: "sc",
		name: "Sardinian",
	},
	{
		code: "sd",
		name: "Sindhi",
	},
	{
		code: "se",
		name: "Northern Sami",
	},
	{
		code: "sm",
		name: "Samoan",
	},
	{
		code: "sg",
		name: "Sango",
	},
	{
		code: "sr",
		name: "Serbian",
	},
	{
		code: "gd",
		name: "Scottish Gaelic; Gaelic",
	},
	{
		code: "sn",
		name: "Shona",
	},
	{
		code: "si",
		name: "Sinhala, Sinhalese",
	},
	{
		code: "sk",
		name: "Slovak",
	},
	{
		code: "sl",
		name: "Slovene",
	},
	{
		code: "so",
		name: "Somali",
	},
	{
		code: "st",
		name: "Southern Sotho",
	},
	{
		code: "es",
		name: "Spanish; Castilian",
	},
	{
		code: "su",
		name: "Sundanese",
	},
	{
		code: "sw",
		name: "Swahili",
	},
	{
		code: "ss",
		name: "Swati",
	},
	{
		code: "sv",
		name: "Swedish",
	},
	{
		code: "ta",
		name: "Tamil",
	},
	{
		code: "te",
		name: "Telugu",
	},
	{
		code: "tg",
		name: "Tajik",
	},
	{
		code: "th",
		name: "Thai",
	},
	{
		code: "ti",
		name: "Tigrinya",
	},
	{
		code: "bo",
		name: "Tibetan Standard, Tibetan, Central",
	},
	{
		code: "tk",
		name: "Turkmen",
	},
	{
		code: "tl",
		name: "Tagalog",
	},
	{
		code: "tn",
		name: "Tswana",
	},
	{
		code: "to",
		name: "Tonga (Tonga Islands)",
	},
	{
		code: "tr",
		name: "Turkish",
	},
	{
		code: "ts",
		name: "Tsonga",
	},
	{
		code: "tt",
		name: "Tatar",
	},
	{
		code: "tw",
		name: "Twi",
	},
	{
		code: "ty",
		name: "Tahitian",
	},
	{
		code: "ug",
		name: "Uyghur, Uighur",
	},
	{
		code: "uk",
		name: "Ukrainian",
	},
	{
		code: "ur",
		name: "Urdu",
	},
	{
		code: "uz",
		name: "Uzbek",
	},
	{
		code: "ve",
		name: "Venda",
	},
	{
		code: "vi",
		name: "Vietnamese",
	},
	{
		code: "vo",
		name: "VolapÃ¼k",
	},
	{
		code: "wa",
		name: "Walloon",
	},
	{
		code: "cy",
		name: "Welsh",
	},
	{
		code: "wo",
		name: "Wolof",
	},
	{
		code: "fy",
		name: "Western Frisian",
	},
	{
		code: "xh",
		name: "Xhosa",
	},
	{
		code: "yi",
		name: "Yiddish",
	},
	{
		code: "yo",
		name: "Yoruba",
	},
	{
		code: "za",
		name: "Zhuang, Chuang",
	},
	{
		code: "zu",
		name: "Zulu",
	},
];

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
	if (!opts.unauthed && Globals.fakeID) {
		reqURL.searchParams.set("fake-id", Globals.fakeID);
	}
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
		body: opts.body,
	});
	if (opts.unauthed) {
		req.headers.delete("Authorization");
	}
	return req;
}

export function minutesToDuration(m, short = false) {
	let reduce = null;
	reduce = (m) => {
		if (m < 60) {
			return "" + Number.parseInt(m) + "m";
		} else if (m < 60 * 24) {
			let h = Number.parseInt(m / 60);
			let remainder = m - h * 60;
			if (remainder === 0) {
				return "" + h + "h";
			} else if (short && h > 2) {
				return "<" + (h + 1) + "h";
			}
			return "" + h + "h " + reduce(remainder);
		} else if (m < 60 * 24 * 7) {
			let d = Number.parseInt(m / (60 * 24));
			let remainder = m - d * 60 * 24;
			if (remainder === 0) {
				return "" + d + "d";
			} else if (short) {
				return "<" + (d + 1) + "d";
			}
			return "" + d + "d " + reduce(remainder);
		} else {
			let w = Number.parseInt(m / (60 * 24 * 7));
			let remainder = m - w * 60 * 24 * 7;
			if (remainder === 0) {
				return "" + w + "w";
			} else if (short) {
				return "<" + (w + 1) + "w";
			}
			return "" + w + "w " + reduce(remainder);
		}
	};
	return reduce(m);
}

export function phaseLengthDisplay(properties) {
	var movementPhase = properties.PhaseLengthMinutes;
	var nonMovementPhase = properties.NonMovementPhaseLengthMinutes;
	var displayString = minutesToDuration(movementPhase);
	if (nonMovementPhase && movementPhase !== nonMovementPhase) {
		displayString += "/" + minutesToDuration(nonMovementPhase);
	}
	return displayString;
}

export function natCol(nation, variant) {
	if (
		Globals.colorOverrides.variants[variant.Properties.Name] &&
		Globals.colorOverrides.variants[variant.Properties.Name][nation]
	) {
		return Globals.colorOverrides.variants[variant.Properties.Name][nation];
	}
	const pos = variant.Properties.Nations.indexOf(nation);
	if (pos === -1) {
		if (nation === "Neutral") {
			return "#d0d0d0";
		}
		// Recognise this as the color of bugs.
		return "#ff00ff";
	}
	// Use Variant.NationColors if set.
	if (
		variant.Properties.NationColors &&
		variant.Properties.NationColors[nation]
	) {
		return variant.Properties.NationColors[nation];
	}
	return Globals.contrastColors[pos];
}

export function twoDecimals(n, up = false) {
	if (up) {
		return 0.01 + Math.ceil(Number.parseFloat(n) * 100) / 100.0;
	}
	return Math.floor(Number.parseFloat(n) * 100) / 100.0;
}

export function unback(f) {
	Globals.backListeners = Globals.backListeners.filter((l) => {
		return l !== f;
	});
}

export function onback(f) {
	Globals.backListeners.unshift(f);
}

export function genOnback(f) {
	return (_) => {
		onback(f);
	};
}

export function genUnbackClose(f) {
	return (_) => {
		unback(f);
		f();
	};
}

export function safeFetch(req, opts = {}) {
	return fetch(req, opts).then((resp) => {
		if (resp.status === 401) {
			localStorage.removeItem("token");
			if (window.Wrapper && window.Wrapper.getToken) {
				return new Promise((res, rej) => {
					const oldCallback = Globals.WrapperCallbacks.getToken;
					Globals.WrapperCallbacks.getToken = (resp) => {
						if (oldCallback) {
							oldCallback(resp);
						}
						if (resp.error) {
							snackbar("Error logging in: " + resp.error);
							res({});
						} else if (resp.token) {
							storeToken(resp.token);
							req.headers.set(
								"Authorization",
								"bearer " + resp.token
							);
							safeFetch(req).then(res);
						} else {
							snackbar("Error logging in, no response at all.");
							res({});
						}
						Globals.WrapperCallbacks.getToken = null;
					};
					if (!oldCallback) {
						window.Wrapper.getToken();
					}
				});
			} else {
				login();
			}
		} else if (resp.status === 400) {
			return new Promise((res, rej) => {
				resp.text().then((s) => {
					if (s.indexOf("Authorization") !== -1) {
						localStorage.removeItem("token");
						req.headers.delete("Authorization");
						safeFetch(req).then(res);
					} else {
						snackbar("Client error: " + s);
					}
				});
			});
		} else {
			return Promise.resolve(resp);
		}
	});
}

export function login(tokenDuration = 60 * 60 * 20) {
	if (window.Wrapper && window.Wrapper.getToken) {
		Globals.WrapperCallbacks.getToken = (resp) => {
			if (resp.error) {
				decProgress();
				snackbar("Error logging in: " + resp.error);
			} else if (resp.token) {
				storeToken(resp.token);
				location.reload();
			} else {
				decProgress();
				snackbar("Error logging in, no response at all.");
			}
		};
		incProgress();
		window.Wrapper.getToken();
	} else if (Globals.loginURL) {
		const hrefURL = new URL(location.href);
		hrefURL.searchParams.delete("token");
		const loginURL = new URL(Globals.loginURL.toString());
		loginURL.searchParams.set("redirect-to", hrefURL.toString());
		loginURL.searchParams.set("token-duration", "" + tokenDuration);
		location.href = loginURL;
	} else {
		location.reload();
	}
}

export function logout() {
	localStorage.removeItem("token");
	location.reload();
}

export function copyToClipboard(s) {
	if (window.Wrapper && window.Wrapper.copyToClipboard) {
		window.Wrapper.copyToClipboard(s);
		return Promise.resolve({});
	} else if (navigator.clipboard && navigator.clipboard.writeText) {
		return navigator.clipboard.writeText(s);
	} else {
		snackbar(
			"Your browser doesn't support clipboard operations and should probably be updated. Here is the text we wanted to copy to your clipboard: " +
				s
		);
		return Promise.reject("no clipboard found");
	}
}

export function deepEqual(x, y) {
	return x && y && typeof x === "object" && typeof y === "object"
		? Object.keys(x).length === Object.keys(y).length &&
				Object.keys(x).reduce(function (isEqual, key) {
					return isEqual && deepEqual(x[key], y[key]);
				}, true)
		: x === y;
}

const conflictSynonyms = [
	"affray",
	"altercation",
	"argument",
	"assault",
	"barrage",
	"battle",
	"bout",
	"brawl",
	"broil",
	"brush",
	"carnage",
	"clash",
	"combat",
	"competition",
	"conflict",
	"confrontation",
	"contention",
	"contest",
	"controversy",
	"crusade",
	"difficulty",
	"disagreement",
	"dispute",
	"dissension",
	"duel",
	"encounter",
	"engagement",
	"exchange",
	"feud",
	"fight",
	"fisticuffs",
	"fracas",
	"fray",
	"free-for-all",
	"fuss",
	"hostility",
	"joust",
	"match",
	"melee",
	"quarrel",
	"rampage",
	"riot",
	"rivalry",
	"row",
	"ruckus",
	"rumble",
	"scrap",
	"scrimmage",
	"scuffle",
	"set-to",
	"skirmish",
	"strife",
	"struggle",
	"tiff",
	"to-do",
	"tussle",
	"war",
	"wrangling",
];

const adjectives = [
	"aback",
	"abaft",
	"abashed",
	"aberrant",
	"abhorrent",
	"abiding",
	"abject",
	"abortive",
	"abounding",
	"abrasive",
	"abstracted",
	"acrid",
	"adamant",
	"adhoc",
	"adjoining",
	"adroit",
	"aloof",
	"amatory",
	"animistic",
	"antic",
	"arcadian",
	"auspicious",
	"axiomatic",
	"baleful",
	"barbarous",
	"bellicose",
	"bilious",
	"boorish",
	"brash",
	"cagey",
	"calamitous",
	"capricious",
	"caustic",
	"cerulean",
	"cloistered",
	"comely",
	"concomitant",
	"contumacious",
	"corpulent",
	"crapulous",
	"craven",
	"dapper",
	"debonair",
	"decorous",
	"defamatory",
	"didactic",
	"dilatory",
	"direful",
	"divergent",
	"dowdy",
	"draconian",
	"efficacious",
	"effulgent",
	"egregious",
	"elated",
	"endemic",
	"erratic",
	"ethereal",
	"execrable",
	"exultant",
	"fallacious",
	"fastidious",
	"feckless",
	"fecund",
	"friable",
	"fulsome",
	"furtive",
	"garrulous",
	"guileless",
	"gustatory",
	"heady",
	"heuristic",
	"histrionic",
	"hubristic",
	"incandescent",
	"incendiary",
	"innate",
	"insidious",
	"insolent",
	"intransigent",
	"inveterate",
	"invidious",
	"irate",
	"irksome",
	"jejune",
	"jocular",
	"judicious",
	"lachrymose",
	"languid",
	"limpid",
	"loquacious",
	"luminous",
	"macabre",
	"mannered",
	"mendacious",
	"meretricious",
	"minatory",
	"mordant",
	"munificent",
	"nebulous",
	"nefarious",
	"nondescript",
	"noxious",
	"obsequious",
	"obtuse",
	"onerous",
	"ossified",
	"overwrought",
	"parsimonious",
	"pendulous",
	"penitent",
	"pernicious",
	"pervasive",
	"petulant",
	"picayune",
	"piquant",
	"placid",
	"platitudinous",
	"plucky",
	"precipitate",
	"propitious",
	"puckish",
	"querulous",
	"quiescent",
	"rebarbative",
	"recalcitrant",
	"recondite",
	"redolent",
	"rhadamanthine",
	"risible",
	"ruminative",
	"sagacious",
	"salubrious",
	"sartorial",
	"sclerotic",
	"serpentine",
	"sordid",
	"spasmodic",
	"spurious",
	"squalid",
	"strident",
	"succinct",
	"taciturn",
	"tawdry",
	"tenacious",
	"tenuous",
	"torpid",
	"tremulous",
	"trenchant",
	"truculent",
	"turbulent",
	"turgid",
	"ubiquitous",
	"uxorious",
	"vacuous",
	"verdant",
	"vivacious",
	"voluble",
	"voracious",
	"waggish",
	"wheedling",
	"wistful",
	"withering",
	"zealous",
	"adamant",
	"adroit",
	"amatory",
	"animistic",
	"antic",
	"arcadian",
	"baleful",
	"bellicose",
	"bilious",
	"boorish",
	"calamitous",
	"caustic",
	"cerulean",
	"comely",
	"concomitant",
	"contumacious",
	"corpulent",
	"crapulous",
	"defamatory",
	"didactic",
	"dilatory",
	"dowdy",
	"efficacious",
	"effulgent",
	"egregious",
	"endemic",
	"equanimous",
	"execrable",
	"fastidious",
	"feckless",
	"fecund",
	"friable",
	"fulsome",
	"garrulous",
	"guileless",
	"gustatory",
	"heuristic",
	"histrionic",
	"hubristic",
	"incendiary",
	"insidious",
	"insolent",
	"intransigent",
	"inveterate",
	"invidious",
	"irksome",
	"jejune",
	"jocular",
	"judicious",
	"lachrymose",
	"limpid",
	"loquacious",
	"luminous",
	"mannered",
	"mendacious",
	"meretricious",
	"minatory",
	"mordant",
	"munificent",
	"nefarious",
	"noxious",
	"obtuse",
	"parsimonious",
	"pendulous",
	"pernicious",
	"pervasive",
	"petulant",
	"platitudinous",
	"precipitate",
	"propitious",
	"puckish",
	"querulous",
	"quiescent",
	"rebarbative",
	"recalcitrant",
	"redolent",
	"rhadamanthine",
	"risible",
	"ruminative",
	"sagacious",
	"salubrious",
	"sartorial",
	"sclerotic",
	"serpentine",
	"spasmodic",
	"strident",
	"taciturn",
	"tenacious",
	"tremulous",
	"trenchant",
	"turbulent",
	"turgid",
	"ubiquitous",
	"uxorious",
	"verdant",
	"voluble",
	"voracious",
	"wheedling",
	"withering",
	"zealous",
];

const nouns = [
	"account",
	"act",
	"adjustment",
	"advertisement",
	"agreement",
	"air",
	"amount",
	"amusement",
	"animal",
	"answer",
	"apparatus",
	"approval",
	"argument",
	"art",
	"attack",
	"attempt",
	"attention",
	"attraction",
	"authority",
	"back",
	"balance",
	"base",
	"behavior",
	"belief",
	"birth",
	"bit",
	"bite",
	"blood",
	"blow",
	"body",
	"brass",
	"bread",
	"breath",
	"brother",
	"building",
	"burn",
	"burst",
	"business",
	"butter",
	"canvas",
	"care",
	"cause",
	"chalk",
	"chance",
	"change",
	"cloth",
	"coal",
	"color",
	"comfort",
	"committee",
	"company",
	"comparison",
	"competition",
	"condition",
	"connection",
	"control",
	"cook",
	"copper",
	"copy",
	"cork",
	"copy",
	"cough",
	"country",
	"cover",
	"crack",
	"credit",
	"crime",
	"crush",
	"cry",
	"current",
	"curve",
	"damage",
	"danger",
	"daughter",
	"day",
	"death",
	"debt",
	"decision",
	"degree",
	"design",
	"desire",
	"destruction",
	"detail",
	"development",
	"digestion",
	"direction",
	"discovery",
	"discussion",
	"disease",
	"disgust",
	"distance",
	"distribution",
	"division",
	"doubt",
	"drink",
	"driving",
	"dust",
	"earth",
	"edge",
	"education",
	"effect",
	"end",
	"error",
	"event",
	"example",
	"exchange",
	"existence",
	"expansion",
	"experience",
	"expert",
	"fact",
	"fall",
	"family",
	"father",
	"fear",
	"feeling",
	"fiction",
	"field",
	"fight",
	"fire",
	"flame",
	"flight",
	"flower",
	"fold",
	"food",
	"force",
	"form",
	"friend",
	"front",
	"fruit",
	"glass",
	"gold",
	"government",
	"grain",
	"grass",
	"grip",
	"group",
	"growth",
	"guide",
	"harbor",
	"harmony",
	"hate",
	"hearing",
	"heat",
	"help",
	"history",
	"hole",
	"hope",
	"hour",
	"humor",
	"ice",
	"idea",
	"impulse",
	"increase",
	"industry",
	"ink",
	"insect",
	"instrument",
	"insurance",
	"interest",
	"invention",
	"iron",
	"jelly",
	"join",
	"journey",
	"judge",
	"jump",
	"kick",
	"kiss",
	"knowledge",
	"land",
	"language",
	"laugh",
	"low",
	"lead",
	"learning",
	"leather",
	"letter",
	"level",
	"lift",
	"light",
	"limit",
	"linen",
	"liquid",
	"list",
	"look",
	"loss",
	"love",
	"machine",
	"man",
	"manager",
	"mark",
	"market",
	"mass",
	"meal",
	"measure",
	"meat",
	"meeting",
	"memory",
	"metal",
	"middle",
	"milk",
	"mind",
	"mine",
	"minute",
	"mist",
	"money",
	"month",
	"morning",
	"mother",
	"motion",
	"mountain",
	"move",
	"music",
	"name",
	"nation",
	"need",
	"news",
	"night",
	"noise",
	"note",
	"number",
	"observation",
	"offer",
	"oil",
	"operation",
	"opinion",
	"order",
	"organization",
	"ornament",
	"owner",
	"page",
	"pain",
	"paint",
	"paper",
	"part",
	"paste",
	"payment",
	"peace",
	"person",
	"place",
	"plant",
	"play",
	"pleasure",
	"point",
	"poison",
	"polish",
	"porter",
	"position",
	"powder",
	"power",
	"price",
	"print",
	"process",
	"produce",
	"profit",
	"property",
	"prose",
	"protest",
	"pull",
	"punishment",
	"purpose",
	"push",
	"quality",
	"question",
	"rain",
	"range",
	"rate",
	"ray",
	"reaction",
	"reading",
	"reason",
	"record",
	"regret",
	"relation",
	"religion",
	"representative",
	"request",
	"respect",
	"rest",
	"reward",
	"rhythm",
	"rice",
	"river",
	"road",
	"roll",
	"room",
	"rub",
	"rule",
	"run",
	"salt",
	"sand",
	"scale",
	"science",
	"sea",
	"seat",
	"secretary",
	"selection",
	"self",
	"sense",
	"servant",
	"sex",
	"shade",
	"shake",
	"shame",
	"shock",
	"side",
	"sign",
	"silk",
	"silver",
	"sister",
	"size",
	"sky",
	"sleep",
	"slip",
	"slope",
	"smash",
	"smell",
	"smile",
	"smoke",
	"sneeze",
	"snow",
	"soap",
	"society",
	"son",
	"song",
	"sort",
	"sound",
	"soup",
	"space",
	"stage",
	"start",
	"statement",
	"steam",
	"steel",
	"step",
	"stitch",
	"stone",
	"stop",
	"story",
	"stretch",
	"structure",
	"substance",
	"sugar",
	"suggestion",
	"summer",
	"support",
	"surprise",
	"swim",
	"system",
	"talk",
	"taste",
	"tax",
	"teaching",
	"tendency",
	"test",
	"theory",
	"thing",
	"thought",
	"thunder",
	"time",
	"tin",
	"top",
	"touch",
	"trade",
	"transport",
	"trick",
	"trouble",
	"turn",
	"twist",
	"unit",
	"use",
	"value",
	"verse",
	"vessel",
	"view",
	"voice",
	"walk",
	"war",
	"wash",
	"waste",
	"water",
	"wave",
	"wax",
	"way",
	"weather",
	"week",
	"weight",
	"wind",
	"wine",
	"winter",
	"woman",
	"wood",
	"wool",
	"word",
	"work",
	"wound",
	"writing",
	"year",
	"angle",
	"ant",
	"apple",
	"arch",
	"arm",
	"army",
	"baby",
	"bag",
	"ball",
	"band",
	"basin",
	"basket",
	"bath",
	"bed",
	"bee",
	"bell",
	"berry",
	"bird",
	"blade",
	"board",
	"boat",
	"bone",
	"book",
	"boot",
	"bottle",
	"box",
	"boy",
	"brain",
	"brake",
	"branch",
	"brick",
	"bridge",
	"brush",
	"bucket",
	"bulb",
	"button",
	"cake",
	"camera",
	"card",
	"carriage",
	"cart",
	"cat",
	"chain",
	"cheese",
	"chess",
	"chin",
	"church",
	"circle",
	"clock",
	"cloud",
	"coat",
	"collar",
	"comb",
	"cord",
	"cow",
	"cup",
	"curtain",
	"cushion",
	"dog",
	"door",
	"drain",
	"drawer",
	"dress",
	"drop",
	"ear",
	"egg",
	"engine",
	"eye",
	"face",
	"farm",
	"feather",
	"finger",
	"fish",
	"flag",
	"floor",
	"fly",
	"foot",
	"fork",
	"fowl",
	"frame",
	"garden",
	"girl",
	"glove",
	"goat",
	"gun",
	"hair",
	"hammer",
	"hand",
	"hat",
	"head",
	"heart",
	"hook",
	"horn",
	"horse",
	"hospital",
	"house",
	"island",
	"jewel",
	"kettle",
	"key",
	"knee",
	"knife",
	"knot",
	"leaf",
	"leg",
	"library",
	"line",
	"lip",
	"lock",
	"map",
	"match",
	"monkey",
	"moon",
	"mouth",
	"muscle",
	"nail",
	"neck",
	"needle",
	"nerve",
	"net",
	"nose",
	"nut",
	"office",
	"orange",
	"oven",
	"parcel",
	"pen",
	"pencil",
	"picture",
	"pig",
	"pin",
	"pipe",
	"plane",
	"plate",
	"plough",
	"pocket",
	"pot",
	"potato",
	"prison",
	"pump",
	"rail",
	"rat",
	"receipt",
	"ring",
	"rod",
	"roof",
	"root",
	"sail",
	"school",
	"scissors",
	"screw",
	"seed",
	"sheep",
	"shelf",
	"ship",
	"shirt",
	"shoe",
	"skin",
	"skirt",
	"snake",
	"sock",
	"spade",
	"sponge",
	"spoon",
	"spring",
	"square",
	"stamp",
	"star",
	"station",
	"stem",
	"stick",
	"stocking",
	"stomach",
	"store",
	"street",
	"sun",
	"table",
	"tail",
	"thread",
	"throat",
	"thumb",
	"ticket",
	"toe",
	"tongue",
	"tooth",
	"town",
	"train",
	"tray",
	"tree",
	"trousers",
	"umbrella",
	"wall",
	"watch",
	"wheel",
	"whip",
	"whistle",
	"window",
	"wing",
	"wire",
	"worm",
];

function randomOf(ary) {
	return ary[Math.floor(Math.random() * ary.length)];
}

function randomOfFunky(basis, ary) {
	const options = [];
	for (let i = 0; i < Math.floor(ary.length / 10); i++) {
		const option = randomOf(ary);
		options.push({
			option: option,
			score: funkyFactor(basis, option),
		});
	}
	options.sort((a, b) => {
		return a.score < b.score ? -1 : 1;
	});
	return options[0].option;
}

// Copied from https://gist.github.com/andrei-m/982927
function dziemba_levenshtein(a, b) {
	var tmp;
	if (a.length === 0) {
		return b.length;
	}
	if (b.length === 0) {
		return a.length;
	}
	if (a.length > b.length) {
		tmp = a;
		a = b;
		b = tmp;
	}

	var i,
		j,
		res,
		alen = a.length,
		blen = b.length,
		row = Array(alen);
	for (i = 0; i <= alen; i++) {
		row[i] = i;
	}

	for (i = 1; i <= blen; i++) {
		res = i;
		for (j = 1; j <= alen; j++) {
			tmp = row[j - 1];
			row[j - 1] = res;
			res =
				b[i - 1] === a[j - 1]
					? tmp
					: Math.min(tmp + 1, Math.min(res + 1, row[j] + 1));
		}
	}
	return res;
}

function funkyFactor(s1, s2) {
	if (s1.length < 3 || s2.length < 3) {
		return dziemba_levenshtein(s1, s2);
	}
	return (
		dziemba_levenshtein(s1.slice(0, 3), s2.slice(0, 3)) +
		dziemba_levenshtein(s1.slice(-3), s2.slice(-3))
	);
}

function capitalize(s) {
	return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export function randomGameName() {
	const synonym = randomOf(conflictSynonyms);
	const adjective = randomOfFunky(synonym, adjectives);
	const noun = randomOfFunky(adjective, nouns);
	return (
		"The " +
		capitalize(synonym) +
		" of the " +
		capitalize(adjective) +
		" " +
		capitalize(noun)
	);
}

export function downloadDataURI(uri, filename) {
	if (window.Wrapper && window.Wrapper.downloadDataURI) {
		window.Wrapper.downloadDataURI(uri, filename);
		return;
	}
	const link = document.createElement("a");
	link.setAttribute("href", uri);
	link.setAttribute("download", filename);
	link.click();
}

export function provName(variant, prov) {
	if (
		variant.Properties.ProvinceLongNames &&
		variant.Properties.ProvinceLongNames[prov]
	) {
		return variant.Properties.ProvinceLongNames[prov];
	}
	return prov;
}

export function humanizeOrder(variant, parts, nextType = null) {
	const types = parts.map((part) => {
		switch (part) {
			case "Support":
			case "Convoy":
			case "Disband":
			case "Hold":
			case "Build":
			case "Move":
				return "OrderType";
			default:
				break;
		}
		return "Province";
	});
	const words = [];
	parts.forEach((part, idx) => {
		if (idx + 1 > parts.length || part !== parts[idx + 1]) {
			if (types[idx] === "Province") {
				words.push(provName(variant, part));
			} else {
				words.push(part.toLowerCase());
			}
			if (
				(idx + 1 === types.length &&
					types[idx] === "Province" &&
					nextType === "Province") ||
				(idx + 1 < types.length &&
					types[idx] === "Province" &&
					types[idx + 1] === "Province") ||
				(types[idx] === "OrderType" && parts[idx] === "Move")
			) {
				words.push("to");
			}
		}
		if (
			idx > 1 &&
			types[idx - 2] === "OrderType" &&
			parts[idx - 2] === "Support" &&
			types[idx - 1] === "Province" &&
			types[idx] === "Province" &&
			parts[idx - 1] === parts[idx]
		) {
			words.push("hold");
		}
	});
	return words.join(" ");
}
