import { useSelector } from "react-redux";

import { PlayerDisplay, diplicityService, selectors } from "../store";
import { RootState } from "../store/store";

const usePlayerDisplay = (id: string): PlayerDisplay => {
  diplicityService.useGetRootQuery(id);
  diplicityService.useGetUserStatsQuery(id);
  return useSelector((state: RootState) =>
    selectors.selectPlayerDisplay(state, id)
  );
};

export default usePlayerDisplay;
