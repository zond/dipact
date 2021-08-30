import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import StatsDialogWrapper from "./components/StatsDialogWrapper";

import LegacyApp from "./LegacyApp";

const App = (): React.ReactElement => {
  return (
    <Router>
      <StatsDialogWrapper>
        <LegacyApp />
      </StatsDialogWrapper>
    </Router>
  );
};

export default App;
