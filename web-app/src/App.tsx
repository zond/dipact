import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorDialogWrapper from "./components/ErrorsDialog";

import FeedbackWrapper from "./components/FeedbackWrapper";
import TokenHandler from "./components/TokenHandler";
import { useGetRootQuery, useListVariantsQuery } from "./hooks/service";
import Router from "./pages/Router";

const App = (): React.ReactElement => {
  useListVariantsQuery(undefined);
  useGetRootQuery(undefined);
  return (
    <Suspense fallback="loading">
      <BrowserRouter>
        <TokenHandler>
          <FeedbackWrapper>
            <ErrorDialogWrapper>
                <Router />
            </ErrorDialogWrapper>
          </FeedbackWrapper>
        </TokenHandler>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
