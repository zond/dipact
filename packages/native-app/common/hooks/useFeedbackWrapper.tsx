import { useDispatch, useSelector } from "react-redux";
import { Feedback, selectors, feedbackActions } from "../store";

interface IUseFeedbackWrapper {
  feedback: Feedback[];
  handleClose: (id: number) => void;
}

const useFeedbackWrapper = (): IUseFeedbackWrapper => {
  const feedback = useSelector(selectors.feedback.selectAll);
  const dispatch = useDispatch();
  const handleClose = (id: number) => dispatch(feedbackActions.clear(id));
  return { feedback, handleClose };
};

export default useFeedbackWrapper;