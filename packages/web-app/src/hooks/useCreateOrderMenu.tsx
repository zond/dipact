import { useDispatch } from "react-redux";

interface ICreateOrderMenu {
  options: { label: string; value: string }[];
  orderSummary: string;
  orderPrompt: string;
  handleSelectOption: (option: string) => void;
  open: boolean;
}

const useCreateOrderMenu = (): ICreateOrderMenu => {
  const dispatch = useDispatch();
  return {
    options: [
      { value: "hold", label: "Hold" },
      { value: "move", label: "Move" },
    ],
    orderSummary: "Army Tyrolia move to...",
    orderPrompt: "Select province to move to",
    handleSelectOption: (option: string) => {
      console.log(option);
    },
    open: true,
  };
};

export default useCreateOrderMenu;