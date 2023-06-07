import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Feedback, FeedbackSliceContext, feedbackSelectors } from "../store";

interface IUseFeedbackWrapper {
  feedback: Feedback[];
  handleClose: (id: number) => void;
}

const useFeedbackWrapper = (): IUseFeedbackWrapper => {
  const { actions } = useContext(FeedbackSliceContext);
  const feedback = useSelector(feedbackSelectors.selectAll);
  const dispatch = useDispatch();
  const handleClose = (id: number) => dispatch(actions.clear(id));
  return { feedback, handleClose };
};

export default useFeedbackWrapper;
