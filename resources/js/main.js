import * as helpers from '%{ cb "/js/helpers.js" }%';

import Login from '%{ cb "/js/login.js" }%';
import MainMenu from '%{ cb "/js/main_menu.js" }%';
import ActivityContainer from '%{ cb "/js/activity_container.js" }%';

export default class Main extends ActivityContainer {
	constructor(props) {
		super(props);
		this.state = {
			activity: Login,
			urls: {}
		};
		this.handleVariants = this.handleVariants.bind(this);
		this.handleRoot = this.handleRoot.bind(this);
	}
	processToken() {
		let hrefURL = new URL(window.location.href);
		let foundToken = hrefURL.searchParams.get("token");
		if (foundToken) {
			hrefURL.searchParams.delete("token");
			history.pushState("", "", hrefURL.toString());
		}

		if (!foundToken) {
			foundToken = localStorage.getItem("token");
		}

		if (foundToken) {
			Globals.token = foundToken;
			Globals.serverRequest.headers.append(
				"Authorization",
				"bearer " + foundToken
			);
		}
	}
	handleVariants(variants) {
		// Order the variants so that Classical is first and the rest are alphabetical.
		variants.sort()
		var classicalIndex = variants.indexOf('Classical');
		if (classicalIndex > 0) {
			variants.unshift(variants.splice(classicalIndex, 1)[0]);
		}

		Globals.variants = variants;
		Globals.variants.forEach(variant => {
			variant.nationAbbreviations = {};
			variant.Properties.Nations.forEach(nation => {
				for (let idx = 0; idx < nation.length; idx++) {
					let matchingNations = variant.Properties.Nations.filter(
						otherNation => {
							return (
								otherNation.indexOf(nation.slice(0, idx + 1)) ==
								0
							);
						}
					).length;
					if (matchingNations == 1) {
						variant.nationAbbreviations[nation] = nation.slice(
							0,
							idx + 1
						);
						break;
					}
				}
			});
		});
	}
	handleRoot(rootJS) {
		Globals.user = rootJS.Properties.User;
		this.setState((state, props) => {
			state = Object.assign({}, state);

			let loginLink = rootJS.Links.find(l => {
				return l.Rel == "login";
			});
			if (loginLink) {
				let loginURL = new URL(loginLink.URL);
				let hrefURL = new URL(window.location.href);
				hrefURL.searchParams.delete("token");
				loginURL.searchParams.set("redirect-to", hrefURL.toString());
				state.urls.login_url = loginURL;
			}

			let linkSetter = rel => {
				let link = rootJS.Links.find(l => {
					return l.Rel == rel;
				});
				if (link) {
					state.urls[rel] = new URL(link.URL);
				}
			};
			linkSetter("my-started-games");
			linkSetter("my-staging-games");
			linkSetter("my-finished-games");
			linkSetter("open-games");
			linkSetter("started-games");
			linkSetter("finished-games");

			if (Globals.user) {
				localStorage.setItem("token", Globals.token);
				state.activity = MainMenu;
				state.activityProps = { urls: state.urls };
			} else if (state.urls.login_url) {
				state.activity = Login;
				state.activityProps = { loginURL: state.urls.login_url };
			}

			return state;
		});
	}
	componentDidMount() {
		this.processToken();
		helpers.incProgress();
		Promise.all([
			helpers
				.safeFetch(
					helpers.createRequest("/Variants", { unauthed: true })
				)
				.then(resp => resp.json()),
			helpers.safeFetch(Globals.serverRequest).then(resp => resp.json())
		]).then(values => {
			helpers.decProgress();
			this.handleVariants(values[0].Properties);
			this.handleRoot(values[1]);
		});
	}
}
