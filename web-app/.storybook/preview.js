import React from "react";

import { addDecorator } from "@storybook/react";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import theme from "../src/theme";

export const parameters = {
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