import React from "react";
import { BrowserRouter } from "react-router-dom";

import StatsDialogWrapper from "./components/StatsDialogWrapper";
import TokenHandler from "./components/TokenHandler";
import { useGetRootQuery, useListVariantsQuery } from "./hooks/service";
import Router from "./pages/Router";

const App = (): React.ReactElement => {
  useListVariantsQuery(undefined);
  useGetRootQuery(undefined);
  return (
    <BrowserRouter>
      <TokenHandler>
        <StatsDialogWrapper>
          <Router />
        </StatsDialogWrapper>
      </TokenHandler>
    </BrowserRouter>
  );
};

export default App;

// cosnt handleRoot(rootJS) {

// 		Globals.user = rootJS.Properties.User;
// 		if (Globals.user) {
// 			helpers
// 				.safeFetch(
// 					helpers.createRequest(
// 						rootJS.Links.find((l) => {
// 							return l.Rel === "latest-forum-mail";
// 						}).URL
// 					)
// 				)
// 				.then((resp) => resp.json())
// 				.then((js) => {
// 					Globals.onNewForumMail(js);
// 				});
// 			helpers.incProgress();
// 			helpers
// 				.safeFetch(
// 					helpers.createRequest(
// 						rootJS.Links.find((l) => {
// 							return l.Rel === "user-stats";
// 						}).URL
// 					)
// 				)
// 				.then((resp) => resp.json())
// 				.then((js) => {
// 					helpers.decProgress();
// 					Globals.userStats = js;
// 					this.presentContent(rootJS);
// 				});
// 			helpers.incProgress();
// 			helpers
// 				.safeFetch(
// 					helpers.createRequest(
// 						rootJS.Links.find((l) => {
// 							return l.Rel === "user-config";
// 						}).URL
// 					)
// 				)
// 				.then((resp) => resp.json())
// 				.then(this.handleUserConfig);
// 			helpers.incProgress();
// 			helpers
// 				.safeFetch(
// 					helpers.createRequest(
// 						rootJS.Links.find((l) => {
// 							return l.Rel === "bans";
// 						}).URL
// 					)
// 				)
// 				.then((res) => res.json())
// 				.then((js) => {
// 					helpers.decProgress();
// 					js.Properties.forEach((ban) => {
// 						if (
// 							ban.Properties.OwnerIds.indexOf(Globals.user.Id) !==
// 							-1
// 						) {
// 							Globals.bans[
// 								ban.Properties.UserIds.find((uid) => {
// 									return uid !== Globals.user.Id;
// 								})
// 							] = ban;
// 						}
// 					});
// 				});
// 		} else {
// 			this.presentContent(rootJS);
// 		}
// 	}
