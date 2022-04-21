jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@rneui/themed", () => ({
  ...jest.requireActual("@rneui/themed"),
  useTheme: jest.fn(() => ({
    theme: {
      spacing: () => 1,
      palette: {
        border: {},
        text: {},
        primary: {},
        secondary: {},
        notification: {},
        background: {},
        paper: {},
        highlight: {},
      },
    },
  })),
}));
