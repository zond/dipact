import {
  IconButton,
  TextField,
  Typography,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  ConfirmedReadyIcon,
  NoOrdersGivenIcon,
  OrdersConfirmedIcon,
  SendMessageIcon,
  WantsDrawIcon,
} from "../../icons";
import NationAvatar from "../NationAvatar";

export interface Nation {
  abbreviation: string;
  color: string;
  flagLink: string;
  name: string;
  isUser: boolean;
}

interface NationSummaryProps {
  confirmedOrders: boolean;
  nation: Nation;
  noOrdersGiven: boolean;
  numBuilds: number;
  numDisbands: number;
  numSupplyCenters: number;
  numSupplyCentersToWin: number;
  wantsDraw: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
  },
  nationDetails: {
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
    "& > div": {
      display: "flex",
      flexDirection: "column",
    },
  },
  nationStatus: {
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
  },
}));

const ORDERS_CONFIRMED_ICON_TITLE = "Confirmed their orders";
const NO_ORDERS_GIVEN_ICON_TITLE = "Did not send orders";
const WANTS_DRAW_ICON_TITLE = "Wants draw";
const SUPPLY_CENTER_LABEL_SINGULAR = "supply center";
const SUPPLY_CENTER_LABEL_PLURAL = "supply centers";

const NationSummary = ({
  confirmedOrders,
  nation,
  numSupplyCenters,
  numSupplyCentersToWin,
  wantsDraw,
  noOrdersGiven,
}: NationSummaryProps): React.ReactElement => {
  const classes = useStyles();

  const supplyCentersLabel =
    numSupplyCenters !== 1
      ? SUPPLY_CENTER_LABEL_PLURAL
      : SUPPLY_CENTER_LABEL_SINGULAR;

  const supplyCentersToWinLabel = `${numSupplyCentersToWin} to win`;

  const nationLabel = nation.isUser ? `${nation.name} (You)` : nation.name;

  return (
    <div className={classes.root}>
      <div className={classes.nationDetails}>
        <div>
          <NationAvatar
            color={nation.color}
            nationAbbreviation={nation.abbreviation}
            nation={nation.name}
            link={nation.flagLink}
          />
        </div>
        <div>
          <Typography variant="body1">{nationLabel}</Typography>
          <Typography variant="body2">
            {numSupplyCenters} {supplyCentersLabel}
          </Typography>
          {nation.isUser && (
            <Typography variant="body2">({supplyCentersToWinLabel})</Typography>
          )}
        </div>
      </div>
      <div className={classes.nationStatus}>
        {confirmedOrders && (
          <Tooltip title={ORDERS_CONFIRMED_ICON_TITLE}>
            <OrdersConfirmedIcon />
          </Tooltip>
        )}
        {wantsDraw && (
          <Tooltip title={WANTS_DRAW_ICON_TITLE}>
            <WantsDrawIcon />
          </Tooltip>
        )}
        {noOrdersGiven && (
          <Tooltip title={NO_ORDERS_GIVEN_ICON_TITLE}>
            <NoOrdersGivenIcon />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default NationSummary;
