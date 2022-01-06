import { screen, waitFor } from "@testing-library/react";

export const getLoadingSpinner = async () => {
  return await waitFor(() => screen.queryByRole("progressbar"));
}
export const userSeesLoadingSpinner = async () => {
  const spinner = await getLoadingSpinner();
  expect(spinner).toBeTruthy();
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
