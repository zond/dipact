import { useEffect } from "react";
import { diplicityService, DiplicityError, ProvinceDisplay } from "../store";

const {
  useGetGameQuery,
  useListVariantsQuery,
  useLazyListOptionsQuery,
} = diplicityService;

interface IUseMap {
  isLoading: boolean;
  isError: boolean;
  error: null | DiplicityError;
  provinces: ProvinceDisplay[];
  handleClickProvince: (id: string) => void;
}

const useMap = (gameId: string): IUseMap => {

  useListVariantsQuery(undefined);
  const { data: game } = useGetGameQuery(gameId);
  const [listOptionsTrigger] = useLazyListOptionsQuery();

  const phaseId = game?.NewestPhaseMeta[0].PhaseOrdinal.toString();

  useEffect(() => {
    if (phaseId) {
      listOptionsTrigger({ gameId, phaseId });
    }
  }, [gameId, listOptionsTrigger, phaseId])

  const handleClickProvince = (id: string) => {
    console.log(id);
  };
  return {
    isLoading: false,
    isError: false,
    error: null,
    provinces: [],
    handleClickProvince,
  };
};

export default useMap;
