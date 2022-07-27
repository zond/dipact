import { useCreateOrderMenu } from "@diplicity/common";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Select,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import useSearchParams from "../hooks/useSearchParams";

interface CreateOrderMenuUrlParams {
  gameId: string;
}

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
  const { gameId } = useParams<CreateOrderMenuUrlParams>();
  const { options, orderSummary, orderPrompt, handleSelectOption } =
    useCreateOrderMenu(close);

  return (
    <Dialog open={open} onClose={close} classes={{ paper: classes.dialog }}>
      <DialogTitle>Create order</DialogTitle>
      <DialogContent>
        <Typography>{orderSummary}</Typography>
        <Typography>{orderPrompt}</Typography>
        <Select className={classes.select}>
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
    </Dialog>
  );
};

export default CreateOrderMenu;
