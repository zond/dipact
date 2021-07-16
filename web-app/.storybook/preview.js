import { addDecorator } from "@storybook/react";
import { MuiThemeProvider } from "@material-ui/core/styles";

import theme from '../src/theme';

addDecorator((story) => (
    <MuiThemeProvider theme={theme}>
      {story()}
    </MuiThemeProvider>
));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}