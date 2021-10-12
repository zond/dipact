import { screen, waitFor } from "@testing-library/react";

export const userSeesLoadingSpinner = async () => {
  await waitFor(() => screen.getByRole("progressbar"));
};

export const userSeesInternalServerErrorMessage = async () => {
  await waitFor(() =>
    screen.getByText("Internal server error", { exact: false })
  );
};

export const userSeesPhaseSelector = async () => {
  await waitFor(() =>
    screen.getByTitle("phase selector", { exact: false })
  );
};