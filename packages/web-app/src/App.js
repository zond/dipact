/* eslint-disable no-restricted-globals */
import * as helpers from "./helpers";
import Login from "./components/Login";
import MainMenu from "./components//MainMenu";
import ActivityContainer from "./components/ActivityContainer";
import Globals from "./Globals";
import Router from "./pages/Router";
import FeedbackWrapper from "./components/FeedbackWrapper";
import actions from "./store/actions";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export class LegacyApp extends ActivityContainer {
  constructor(props) {
    super(props);
    this.state = {
      activity: Login,
      urls: {},
    };
    this.handleVariants = this.handleVariants.bind(this);
    this.handleRoot = this.handleRoot.bind(this);
    this.handleUserConfig = this.handleUserConfig.bind(this);
    this.renderPath = this.renderPath.bind(this);
    this.presentContent = this.presentContent.bind(this);
    Globals.messaging.main = this;
  }
  renderPath(path) {
    // This is just to force everything to re-render.
    this.setState({ activity: "div" }, (_) => {
      history.pushState("", "", path);
      this.setActivity(MainMenu, { urls: this.state.urls });
    });
  }
  handleVariants(variants) {
    // Order the variants so that Classical is first and the rest are alphabetical.
    variants.sort((variantA, variantB) =>
      variantA.Name > variantB.Name ? 1 : -1
    );
    var classicalIndex = variants.findIndex(
      (variant) => variant.Name === "Classical"
    );
    if (classicalIndex > 0) {
      variants.unshift(variants.splice(classicalIndex, 1)[0]);
    }

    Globals.variants = variants;
    Globals.variants.forEach((variant) => {
      Globals.colorOverrides.variantCodes[
        variant.Properties.Name.replace(helpers.overrideReg, "")
      ] = variant.Properties.Name;
      variant.nationAbbreviations = {};
      variant.Properties.Nations.forEach((nation) => {
        Globals.colorOverrides.nationCodes[
          nation.replace(helpers.overrideReg, "")
        ] = nation;
        for (let idx = 0; idx < nation.length; idx++) {
          let matchingNations = variant.Properties.Nations.filter(
            (otherNation) => {
              return otherNation.indexOf(nation.slice(0, idx + 1)) === 0;
            }
          ).length;
          if (matchingNations === 1) {
            variant.nationAbbreviations[nation] = nation.slice(0, idx + 1);
            break;
          }
        }
      });
    });
    if (
      Globals.userConfig.Properties.Colors &&
      Globals.userConfig.Properties.Colors.length > 0
    ) {
      helpers.parseUserConfigColors();
    }
  }
  processToken() {
    let hrefURL = new URL(location.href);
    let foundToken = hrefURL.searchParams.get("token");
    if (foundToken) {
      hrefURL.searchParams.delete("token");
      history.pushState("", "", hrefURL.toString());
    }

    if (!foundToken) {
      foundToken = localStorage.getItem("token");
    }

    if (foundToken) {
      helpers.storeToken(foundToken);
    }
  }
  presentContent(rootJS) {
    this.setState((state, props) => {
      state = Object.assign({}, state);

      let loginLink = rootJS.Links.find((l) => {
        return l.Rel === "login";
      });
      if (loginLink) {
        Globals.loginURL = new URL(loginLink.URL);
      }

      let linkSetter = (rel) => {
        let link = rootJS.Links.find((l) => {
          return l.Rel === rel;
        });
        if (link) {
          state.urls[rel] = new URL(link.URL);
        }
      };
      linkSetter("mastered-started-games");
      linkSetter("mastered-staging-games");
      linkSetter("mastered-finished-games");
      linkSetter("my-started-games");
      linkSetter("my-staging-games");
      linkSetter("my-finished-games");
      linkSetter("open-games");
      linkSetter("started-games");
      linkSetter("finished-games");

      if (rootJS.Properties.User) {
        if (
          window.Wrapper &&
          window.Wrapper.pendingAction &&
          window.Wrapper.pendingAction()
        ) {
          this.renderPath(window.Wrapper.pendingAction());
        } else {
          state.activity = MainMenu;
          state.activityProps = { urls: state.urls };
        }
      } else if (state.urls.login_url) {
        state.activity = Login;
      }

      return state;
    });
  }
  handleUserConfig(configJS) {
    helpers.decProgress();
    Globals.userConfig = configJS;
    if (Globals.messaging.findGlobalToken()) {
      Globals.messaging.start();
    }
    if (Globals.variants.length > 0) {
      helpers.parseUserConfigColors();
    }
  }
  handleRoot(rootJS) {
    const user = rootJS.Properties.User;
    Globals.user = user;
    if (user) {
      helpers
        .safeFetch(
          helpers.createRequest(
            rootJS.Links.find((l) => {
              return l.Rel === "latest-forum-mail";
            }).URL
          )
        )
        .then((resp) => resp.json())
        .then((js) => {
          Globals.onNewForumMail(js);
        });
      helpers.incProgress();
      helpers
        .safeFetch(
          helpers.createRequest(
            rootJS.Links.find((l) => {
              return l.Rel === "user-stats";
            }).URL
          )
        )
        .then((resp) => resp.json())
        .then((js) => {
          helpers.decProgress();
          Globals.userStats = js;
          this.presentContent(rootJS);
        });
      helpers.incProgress();
      helpers
        .safeFetch(
          helpers.createRequest(
            rootJS.Links.find((l) => {
              return l.Rel === "user-config";
            }).URL
          )
        )
        .then((resp) => resp.json())
        .then(this.handleUserConfig);
      helpers.incProgress();
      helpers
        .safeFetch(
          helpers.createRequest(
            rootJS.Links.find((l) => {
              return l.Rel === "bans";
            }).URL
          )
        )
        .then((res) => res.json())
        .then((js) => {
          helpers.decProgress();
          js.Properties.forEach((ban) => {
            if (ban.Properties.OwnerIds.indexOf(Globals.user.Id) !== -1) {
              Globals.bans[
                ban.Properties.UserIds.find((uid) => {
                  return uid !== Globals.user.Id;
                })
              ] = ban;
            }
          });
        });
    } else {
      this.presentContent(rootJS);
    }
  }
  componentDidMount() {
    this.processToken();
    helpers.incProgress();
    Promise.all([
      helpers
        .safeFetch(helpers.createRequest("/Variants", { unauthed: true }))
        .then((resp) => resp.json()),
      helpers.safeFetch(Globals.serverRequest).then((resp) => resp.json()),
      helpers
        .safeFetch(helpers.createRequest("/Users/Ratings/Histogram"))
        .then((resp) => resp.json())
        .then((js) => {
          Globals.userRatingHistogram = js;
        }),
    ]).then((values) => {
      helpers.decProgress();
      this.handleVariants(values[0].Properties);
      this.handleRoot(values[1]);
    });
  }
}

const useInitialized = () => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    dispatch(actions.initialize());
    setIsInitialized(true);
  }, [dispatch]);
  return isInitialized;
};

const App = () => {
  // Ensure that initialize action is dispatched before rendering app
  const isInitialized = useInitialized();
  if (!isInitialized) return null;
  return (
    <FeedbackWrapper>
      <Router />
    </FeedbackWrapper>
  );
};

export default App;
