import React, { useEffect } from "react";
import ReactGA from "react-ga";

import LegacyApp from "./LegacyApp";
import {
	useGetUserRatingHistogramQuery,
	useListVariantsQuery,
} from "./hooks/service";
import FeedbackWrapper from "./components/FeedbackWrapper";

const App = (): React.ReactElement => {
	useGetUserRatingHistogramQuery(undefined);
	useListVariantsQuery(undefined);

	useEffect(() => {
		ReactGA.initialize("G-CZXEZSNBW4", {});
		ReactGA.set({
			dimension1: "client",
			dimension2: "api",
		});
	}, []);

	return (
		<FeedbackWrapper>
			<LegacyApp />
		</FeedbackWrapper>
	)
};

export default App;
