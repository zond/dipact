import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import StatsDialogWrapper from "./components/StatsDialogWrapper";
import LegacyApp from "./LegacyApp";
import {
	useListVariantsQuery,
} from "./hooks/service";

const App = (): React.ReactElement => {
  useListVariantsQuery(undefined);
  return (
    <Router>
      <StatsDialogWrapper>
        <LegacyApp />
      </StatsDialogWrapper>
    </Router>
  );
};

export default App;
