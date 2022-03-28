import { User } from "./store";
import contrastColors from "./utils/contrastColors";

const serverURL = new URL("https://diplicity-engine.appspot.com/");
interface IGlobals {
  user: User | null;
  [key: string]: any;
}

interface IWrapper {}

declare global {
  interface Window {
    Globals: IGlobals;
    Wrapper: IWrapper;
  }
}

window.Globals = {
  serverRequest: new Request(serverURL.toString(), {
    headers: {
      "X-Diplicity-API-Level": "8",
      Accept: "application/json",
      "X-Diplicity-Client-Name": "dipact@", // TODO
    },
    mode: "cors",
  }),
  user: null,
  onNewForumMail: (fm: any) => {
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
  // messaging: Messaging,
  contrastColors: contrastColors,
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
  fakeID: {},
};

export default window.Globals;
