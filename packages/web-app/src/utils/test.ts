import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const clickSelectOption = async (
  selectLabel: string,
  optionLabel: string
) => {
  const select = screen.getByLabelText(selectLabel);
  userEvent.click(select);
  const optionsPopup = await screen.findByRole("listbox", {
    name: selectLabel,
  });
  userEvent.click(within(optionsPopup).getByText(optionLabel));
};
