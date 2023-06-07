import React from "react";
import { FeedbackSliceContextProviderProps } from "./feedback.types";
import { createContext } from "react";
import { createFeedbackSlice } from "./feedback";

const FeedbackSliceContext = createContext<
  ReturnType<typeof createFeedbackSlice>
>({} as ReturnType<typeof createFeedbackSlice>);

const FeedbackSliceProvider = (props: FeedbackSliceContextProviderProps) => {
  return (
    <FeedbackSliceContext.Provider value={props.feedbackSlice}>
      {props.children}
    </FeedbackSliceContext.Provider>
  );
};

export { FeedbackSliceContext, FeedbackSliceProvider };
