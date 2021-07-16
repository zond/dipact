import React, { useEffect } from "react";
import ReactGA from "react-ga";

import LegacyApp from "./LegacyApp";
import {
	useGetRootQuery,
	useGetUserRatingHistogramQuery,
	useGetVariantsQuery,
} from "./store/service";

const App = (): React.ReactElement => {
	useGetRootQuery(undefined);
	useGetUserRatingHistogramQuery(undefined);
	useGetVariantsQuery(undefined);

	useEffect(() => {
		ReactGA.initialize("G-CZXEZSNBW4", {});
		ReactGA.set({
			dimension1: "client",
			dimension2: "api",
		});
	}, []);

	return <LegacyApp />;
};

export default App;
