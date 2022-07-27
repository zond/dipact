import { Container, Fab } from "@material-ui/core";

import { useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import {
  DiplicityError,
  gameActions,
  ProvinceDisplay,
  UnitType,
  useMap,
} from "@diplicity/common";
import { useTranslation } from "react-i18next";
import CreateOrderMenu, { searchKey } from "../components/CreateOrderMenu";
import Province from "../components/Province";
import { CreateOrderIcon } from "../icons";
import { useEffect, useState } from "react";
import useSearchParams from "../hooks/useSearchParams";
import { useDispatch } from "react-redux";

const provinces: ProvinceDisplay[] = [
  {
    name: "Liverpool",
    id: "liv",
    color: "blue",
    unit: {
      type: UnitType.Fleet,
      color: "blue",
    },
    dislodgedUnit: null,
    highlight: true,
  },
];

interface MapUrlParams {
  gameId: string;
}

const Map = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { gameId } = useParams<MapUrlParams>();
  const [createOrderMenuOpen, setCreateOrderMenuOpen] = useState(false);
  const { setParam } = useSearchParams();
  const { isLoading, isError, error, handleClickProvince } = useMap(gameId);

  useEffect(() => {
    dispatch(gameActions.setGameId(gameId));
  }, [dispatch, gameId]);

  if (isError && error) return <ErrorMessage error={error as DiplicityError} />;
  if (isLoading) return <Loading />;

  return (
    <>
      <CreateOrderMenu />
      <Fab
        color="primary"
        aria-label="add"
        // TODO move fab position to constants
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        onClick={() => setParam(searchKey, "1")}
      >
        <CreateOrderIcon />
      </Fab>
    </>
  );
};

export default Map;
