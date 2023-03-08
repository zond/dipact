import { useSelector } from "react-redux";

import { diplicityService, selectors } from "../store";
import { RootState } from "../store/store";

const usePlayerDisplay = (id: string) => {
  diplicityService.useGetUserStatsQuery(id);
  return useSelector((state: RootState) =>
    selectors.selectPlayerDisplay(state, id)
  );
};

export default usePlayerDisplay;
