import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectors, viewActions } from "../store";

interface IUseMap extends ReturnType<typeof selectors.selectMapView> {}

const useMap = (gameId: string): IUseMap => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(viewActions.initializeMapView(gameId));
  }, [dispatch, gameId]);

  const { data, isLoading, isError } = useSelector(selectors.selectMapView);

  return {
    isLoading,
    isError,
    data,
  };
};

export default useMap;
