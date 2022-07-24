import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@material-ui/core";
import useCreateOrderMenu from "../hooks/useCreateOrderMenu";

const CreateOrderMenu = () => {
  const { options, orderSummary, orderPrompt, handleSelectOption, open } =
    useCreateOrderMenu();
  return (
    <Dialog open={open}>
      <DialogTitle>Create order</DialogTitle>
      <DialogContent>
        <Typography>{orderSummary}</Typography>
        <Typography>{orderPrompt}</Typography>
      </DialogContent>
      <DialogActions>
        {options.map((option) => (
          <Button onClick={() => handleSelectOption(option.value)} key={option.value}>
            {option.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderMenu;
