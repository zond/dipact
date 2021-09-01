import { Middleware } from "redux";
import { submitSettingsForm } from "./actions";
import { selectUserConfig } from "./selectors";
import { diplicityService } from "./service";

export const submitSettingsFormMiddleware: Middleware<{}, any> =
	({ getState, dispatch }) =>
	(next) =>
	(action) => {
		next(action);
		if (action.type === submitSettingsForm.type) {
            const state = getState();
            const userConfig = selectUserConfig(state);
            if (!userConfig) return;
			dispatch<any>(
				diplicityService.endpoints.updateUserConfig.initiate(userConfig, { track: true })
			);
		}
	};

const middleware = [submitSettingsFormMiddleware];
export default middleware;
