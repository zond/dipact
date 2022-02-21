import React from "react";

import { addDecorator } from "@storybook/react";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import theme from "../src/theme";
import { i18n } from "@diplicity/common";

export const parameters = {
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: "centered",
};

const generateClassName = (rule, styleSheet) =>
  `${styleSheet.options.classNamePrefix}-${rule.key}`;

addDecorator((story) => (
  <StyledEngineProvider injectFirst generateClassName={generateClassName}>
    <ThemeProvider theme={theme}>{story()}</ThemeProvider>
  </StyledEngineProvider>
));
