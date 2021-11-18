import { useContext, createContext } from "react";
import { useDispatch } from "react-redux";

import { actions as authActions } from "../store/auth";
import { useSelectUser } from "./selectors";

export interface IUseMainMenu {
  logout: () => void;
  user: {
    Picture: string | undefined;
    Email: string | undefined;
    Id: string | undefined;
  };
}

const useMainMenu = (): IUseMainMenu => {
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());
  const { Picture, Email, Id } = useSelectUser();
  return {
    user: {
      Picture,
      Email,
      Id,
    },
    logout,
  };
};

export const useMainMenuContext = createContext<null | typeof useMainMenu>(
  null
);

const createDIContext = <T>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useMainMenu>();

const useGetHook = () => useContext(useDIContext) || useMainMenu;
const useDIHook = (): IUseMainMenu => useGetHook()();

export default useDIHook;
