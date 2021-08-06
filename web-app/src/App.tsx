import React, { useEffect } from "react";
import ReactGA from "react-ga";

import LegacyApp from "./LegacyApp";
import {
	useGetRootQuery,
	useGetUserRatingHistogramQuery,
	useListVariantsQuery,
} from "./hooks/service";

const App = (): React.ReactElement => {
	useGetRootQuery(undefined);
	useGetUserRatingHistogramQuery(undefined);
	useListVariantsQuery(undefined);

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
