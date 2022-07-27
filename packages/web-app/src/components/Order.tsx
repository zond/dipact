import React from "react";
import { makeStyles, Theme, Typography } from "@material-ui/core";

import {
  OrderDisplay,
  ResolutionDisplay,
  translateKeys as tk,
} from "@diplicity/common";
import { useTranslation } from "react-i18next";

interface StyleProps {
  resolution: ResolutionDisplay | null;
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
      resolution?.message === tk.orders.resolution.success
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

interface OrderProps {
  order: OrderDisplay;
}

const Order = ({ order }: OrderProps) => {
  const { t } = useTranslation();
  const { label, resolution } = order;
  const classes = useStyles({ resolution });

  return (
    <>
      <div className={classes.root}>
        <Typography>{label}</Typography>
        {resolution && (
          <Typography className={classes.orderResolution}>
            {t(resolution.message, { province: resolution.province })}
          </Typography>
        )}
      </div>
      {/* <ul className={classes.orderInconsistencies}>
        {inconsistencies.map((inconsistency) => (
          <li key={inconsistency}>
            <Typography variant="body2">{inconsistency}</Typography>
          </li>
        ))}
      </ul> */}
    </>
  );
};

export default Order;
