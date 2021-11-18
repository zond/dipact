import { useHistory, useLocation } from "react-router";

const useSearchParams = (): {
  values: IterableIterator<[string, string]>;
  setParam: (paramName: string, value: string) => void;
  removeParam: (paramName: string) => void;
} => {
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const values = searchParams.entries();
  const removeParam = (paramName: string) => {
    searchParams.delete(paramName);
    history.replace({
      search: searchParams.toString(),
    });
  };
  const setParam = (paramName: string, value: string) => {
    searchParams.set(paramName, value);
    history.replace({
      search: searchParams.toString(),
    });
  };
  return { values, setParam, removeParam };
};

export default useSearchParams;
