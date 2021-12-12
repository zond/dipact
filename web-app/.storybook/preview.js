import React from 'react';

import { addDecorator } from '@storybook/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import { muiTheme } from '../src/theme';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
}

addDecorator((story) => (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>{story()}</ThemeProvider>
    </StyledEngineProvider>
));