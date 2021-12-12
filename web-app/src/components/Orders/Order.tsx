/* eslint-disable no-restricted-globals */
import React from "react";
import { Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from "@mui/material";

interface StyleProps {
  resolution: string | null;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  orderResolution: {
    display: "flex",
    justifyContent: "flex-end",
    color: ({ resolution }) =>
      resolution === "Success"
        ? theme.palette.success.main
        : theme.palette.error.main,
  },
  orderInconsistencies: {
    color: theme.palette.error.main,
    paddingInlineStart: 0,
    "& li": {
      paddingTop: "0",
      paddingBottom: "0",
    },
  },
}));

export interface OrderDisplay {
  label: string;
  inconsistencies: string[];
  resolution: string | null;
}

interface OrderProps {
  order: OrderDisplay;
}

const Order = ({ order }: OrderProps) => {
  const { resolution } = order;
  const classes = useStyles({ resolution });

  return (
    <>
      <div className={classes.root}>
        <Typography>{order.label}</Typography>
        {order.resolution && (
          <Typography className={classes.orderResolution}>
            {order.resolution}
          </Typography>
        )}
      </div>
      <ul className={classes.orderInconsistencies}>
        {order.inconsistencies.map((inconsistency) => (
          <li>
            <Typography variant="body2">{inconsistency}</Typography>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Order;
