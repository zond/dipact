import { useHistory, useLocation } from "react-router-dom";

const useSearchParams = (): {
  getParam: (paramName: string) => string | null;
  setParam: (paramName: string, value: string) => void;
  removeParam: (paramName: string) => void;
  values: string;
} => {
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const getParam = (paramName: string): string | null => {
    return searchParams.get(paramName);
  }
  const setParam = (paramName: string, value: string) => {
    searchParams.set(paramName, value);
    history.replace({
      search: searchParams.toString(),
    });
  };
  const removeParam = (paramName: string) => {
    searchParams.delete(paramName);
    history.replace({
      search: searchParams.toString(),
    });
  };
  const values = JSON.stringify(searchParams.entries());
  return { getParam, setParam, removeParam, values };
};

export default useSearchParams;
