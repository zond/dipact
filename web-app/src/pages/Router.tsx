import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Start from "./Start";

const Router = (): React.ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={["/"]} component={() => <Start />} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
