import { createDiplicityApi } from "../diplicity";

export interface Feedback {
  id: number;
  severity: "error" | "warning" | "info" | "success";
  message: string;
}

export type CreateFeedbackSliceOptions = {
  diplicityApi: ReturnType<typeof createDiplicityApi>;
};
