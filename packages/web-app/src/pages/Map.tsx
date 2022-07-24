import {
  Container,
} from "@material-ui/core";

import { useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import {
  DiplicityError,
  ProvinceDisplay,
  UnitType,
} from "@diplicity/common";
import { useTranslation } from "react-i18next";
import useMap from "../hooks/useMap";
import CreateOrderMenu from "../components/CreateOrderMenu";
import Province from "../components/Province";

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
  const { gameId } = useParams<MapUrlParams>();
  const { isLoading, isError, error, handleClickProvince } = useMap(gameId);

  if (isError && error) return <ErrorMessage error={error as DiplicityError} />;
  if (isLoading) return <Loading />;

  return (
    <>
      <Container>
        {provinces.map((province) => (
          <Province {...province} handleClick={handleClickProvince} key={province.id} />
        ))}
      </Container>
      <CreateOrderMenu />
    </>
  );
};

export default Map;
