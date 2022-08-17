import { useCreateOrderMenu } from "@diplicity/common";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Select,
  MenuItem,
  makeStyles,
  InputLabel,
  Button,
  DialogActions,
} from "@material-ui/core";
import { t } from "i18next";
import useSearchParams from "../hooks/useSearchParams";

export const searchKey = "create-order-menu";

const useStyles = makeStyles(() => ({
  dialog: {
    width: "50%",
  },
  select: {
    width: "100%",
  },
}));

const CreateOrderMenu = () => {
  const classes = useStyles();
  const { getParam, removeParam } = useSearchParams();
  const open = Boolean(getParam(searchKey));
  const close = () => {
    removeParam(searchKey);
  };
  const { options, orderSummary, orderPrompt, handleSelectOption } =
    useCreateOrderMenu(close);

  return (
    <Dialog open={open} onClose={close} classes={{ paper: classes.dialog }}>
      <DialogTitle>Create order</DialogTitle>
      <DialogContent>
        <Typography>{orderSummary}</Typography>
        <Typography>{orderPrompt}</Typography>
        <InputLabel id="select-option">Select option</InputLabel>
        <Select labelId={"select-option"} className={classes.select}>
          {options &&
            options.map((option) => (
              <MenuItem
                onClick={() => handleSelectOption(option.value)}
                key={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderMenu;
