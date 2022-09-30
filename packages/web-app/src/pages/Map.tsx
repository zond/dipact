import { Fab } from "@material-ui/core";

import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useMap } from "@diplicity/common";
import CreateOrderMenu, { searchKey } from "../components/CreateOrderMenu";
import { CreateOrderIcon } from "../icons";
import useSearchParams from "../hooks/useSearchParams";
import Svg from "react-inlinesvg";

interface MapUrlParams {
  gameId: string;
}

const Map = () => {
  const { gameId } = useParams<MapUrlParams>();
  const { setParam } = useSearchParams();
  const { data, isLoading } = useMap(gameId);

  // if (isError && error) return <ErrorMessage error={error as DiplicityError} />;
  if (isLoading) return <Loading />;

  return (
    <>
      {data && <Svg src={data} />}
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
