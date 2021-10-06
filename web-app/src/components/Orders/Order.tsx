/* eslint-disable no-restricted-globals */
import React from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { Typography } from "@material-ui/core";

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
    "& li": {
      paddingTop: "0",
      paddingBottom: "0",
    },
  },
}));

interface OrderProps {
  order: {
    label: string;
    inconsistencies: string[];
    resolution: string | null;
  };
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
            <Typography>{inconsistency}</Typography>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Order;
