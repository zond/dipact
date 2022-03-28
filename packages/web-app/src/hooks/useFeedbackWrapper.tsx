import { useDispatch } from "react-redux";
import { Feedback, feedbackActions, selectors } from "@diplicity/common";
import { useAppSelector } from "./useAppSelector";

interface IUseFeedbackWrapper {
  feedback: Feedback[];
  handleClose: (id: number) => void;
}

const useFeedbackWrapper = (): IUseFeedbackWrapper => {
  const feedback = useAppSelector(selectors.feedback.selectAll);
  const dispatch = useDispatch();
  const handleClose = (id: number) => dispatch(feedbackActions.clear(id));
  return { feedback, handleClose };
};

export default useFeedbackWrapper;