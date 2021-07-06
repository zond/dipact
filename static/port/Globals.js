import $ from "jquery";

import dippyMap from "./port/dippymap";
import Messaging from "./messaging";

// TODO remove this after port to standard React is finished
const hrefURL = new URL(location.href);

const serverURL = new URL(
  localStorage.getItem("serverURL") || "https://diplicity-engine.appspot.com/"
);
const fakeID = localStorage.getItem("fakeID");
if (fakeID) {
  serverURL.searchParams.set("fake-id", fakeID);
}

const Globals = {
  serverRequest: new Request(serverURL, {
    headers: {
      "X-Diplicity-API-Level": "8",
      Accept: "application/json",
      "X-Diplicity-Client-Name": "dipact@" + hrefURL.host,
    },
    mode: "cors",
  }),
  user: {},
  onNewForumMail: (fm) => {
    window.Globals.latestForumMail = fm;
  },
  latestForumMail: null,
  userStats: { Properties: { TrueSkill: {} } },
  userConfig: { Properties: { FCMTokens: [], MailConfig: {}, Colors: [] } },
  token: null,
  progressCount: 0,
  progressDialog: null,
  snackbar: null,
  variants: [],
  memoizeCache: {},
  messaging: Messaging,
  contrastColors: (() => {
    const m = dippyMap($("body"));
    return m.contrasts;
  })(),
  colorOverrides: {
    nationCodes: {},
    variantCodes: {},
    positions: [],
    variants: {},
    nations: {},
  },
  backListeners: [],
  WrapperCallbacks: {},
  bans: {},
  loginURL: null,
  userRatingHistogram: null,
  fakeID: fakeID,
};

addEventListener("popstate", () => {
  if (Globals.backListeners.length > 0) {
    const listener = Globals.backListeners.shift();
    listener();
  } else {
    location.reload();
  }
});

export default Globals;
