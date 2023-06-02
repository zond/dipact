import { createDiplicityApi } from "../diplicity";
import { createFeedbackSlice } from "./feedback";

export interface Feedback {
  id: number;
  severity: "error" | "warning" | "info" | "success";
  message: string;
}

export type CreateFeedbackSliceOptions = {
  diplicityApi: ReturnType<typeof createDiplicityApi>;
};

export type FeedbackSliceContextProviderProps = {
  children: React.ReactNode;
  feedbackSlice: ReturnType<typeof createFeedbackSlice>;
};
