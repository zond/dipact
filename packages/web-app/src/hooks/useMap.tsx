import { DiplicityError, ProvinceDisplay } from "@diplicity/common";

interface IUseMap {
  isLoading: boolean;
  isError: boolean;
  error: null | DiplicityError;
  provinces: ProvinceDisplay[];
  handleClickProvince: (id: string) => void;
}

const useMap = (gameId: string): IUseMap => {
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
