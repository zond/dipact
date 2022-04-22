import { useDispatch } from "react-redux";

import { authActions, selectors } from "@diplicity/common";
import { useAppSelector } from "./useAppSelector";

interface UseMainMenu {
  logout: () => void;
  user: ReturnType<typeof selectors.selectUser>;
}

const useMainMenu = (): UseMainMenu => {
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());
  const user = useAppSelector(selectors.selectUser);
  return { user, logout };
};

export default useMainMenu;
