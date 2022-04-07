import { User } from "./store";

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

const Globals = {
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

export default Globals;
