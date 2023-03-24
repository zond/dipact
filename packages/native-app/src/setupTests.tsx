jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@rneui/themed", () => ({
  ...jest.requireActual("@rneui/themed"),
  useTheme: jest.fn(() => ({
    theme: {
      components: {
        Button: {},
        Text: {},
        Chip: {},
      },
      spacing: () => 1,
      palette: {
        border: {},
        text: {},
        error: {},
        primary: {},
        secondary: {},
        notification: {},
        background: {},
        paper: {},
        highlight: {},
        success: {},
        nmr: {},
      },
      typography: {},
    },
  })),
}));

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSigninButton: jest.fn(() => <div />),
}));

jest.mock("react-native-image-pan-zoom", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));

jest.mock("@reduxjs/toolkit", () => ({
  ...jest.requireActual("@reduxjs/toolkit"),
  configureStore: () => ({}),
}));

jest.mock("@reduxjs/toolkit/query/react", () => ({
  ...jest.requireActual("@reduxjs/toolkit/query/react"),
  fetchBaseQuery: jest.fn(),
}));

jest.mock("./components/QueryContainer", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ query, render }) => {
    return render(query.data);
  }),
}));
