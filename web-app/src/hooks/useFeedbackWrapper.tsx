import { createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { Feedback } from "../store/types";
import { useFeedback } from "./selectors";
import { actions as feedbackActions } from "../store/feedback";

interface IUseFeedbackWrapper {
    feedback: Feedback[];
    handleClose: (id: number) => void;
}

const useFeedbackWrapper = (): IUseFeedbackWrapper => {
  const feedback = useFeedback();
  const dispatch = useDispatch();

  const handleClose = (id: number) => dispatch(feedbackActions.clear(id));

  return { feedback, handleClose }
};

export const useFeedbackWrapperContext = createContext<null | typeof useFeedbackWrapper>(null);

const createDIContext = <T,>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useFeedbackWrapper>();

const useGetHook = () => useContext(useDIContext) || useFeedbackWrapper;
const useDIHook = (): IUseFeedbackWrapper => useGetHook()();

export const feedbackWrapperDecorator = (values: IUseFeedbackWrapper) => {
  return (Component: () => JSX.Element) => (
    <useDIContext.Provider value={() => values}>
      <Component />
    </useDIContext.Provider>
  );
};

export default useDIHook;