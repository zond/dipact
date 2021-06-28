import { MuiThemeProvider } from "@material-ui/core/styles";
import React from "react";
import ReactGA from "react-ga";
import { Provider } from "react-redux";

import Start from "./pages/Start";
import theme from "./theme";
import { store } from "./store";

const App = (): React.ReactElement => {
  ReactGA.initialize("Your Unique ID");
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Start />
      </Provider>
    </MuiThemeProvider>
  );
};

export default App;
