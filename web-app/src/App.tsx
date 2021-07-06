import React, { useEffect } from "react";
import ReactGA from "react-ga";

import Router from "./pages/Router";
import Messaging from "./helpers/messaging";
import { useAppSelector } from "./hooks/store";
import {
  useGetRootQuery,
  useGetUserRatingHistogramQuery,
  useGetVariantsQuery,
} from "./store/service";

const App = (): React.ReactElement => {
  ReactGA.initialize("Your Unique ID");
  const userConfig = useAppSelector((state) => state.userConfig);

  useGetRootQuery(undefined);
  useGetUserRatingHistogramQuery(undefined);
  useGetVariantsQuery(undefined);

  useEffect(() => {
    if (userConfig.loaded) {
      console.log("userConfig loaded");
      const messaging = new Messaging(userConfig);
    }
  }, []);
  return <Router />;
};

export default App;
