import { Typography, Tooltip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import { NationStatus } from "../../hooks/useOrders";
import {
  NoOrdersGivenIcon,
  OrdersConfirmedIcon,
  WantsDrawIcon,
} from "../../icons";
import NationAvatar from "../NationAvatar";
import tk from "../../translations/translateKeys";

export interface Nation {
  abbreviation: string;
  color: string;
  flagLink: string;
  name: string;
  isUser: boolean;
}

interface NationSummaryProps {
  nationStatus: NationStatus;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
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

const NationSummary = ({
  nationStatus,
}: NationSummaryProps): React.ReactElement => {
  const {
    confirmedOrders,
    nation,
    numSupplyCenters,
    numSupplyCentersToWin,
    wantsDraw,
    noOrdersGiven,
    numBuilds,
    numDisbands,
  } = nationStatus;
  const classes = useStyles();

  const supplyCentersLabel =
    numSupplyCenters !== 1
      ? tk.orders.supplyCenter.plural
      : tk.orders.supplyCenter.singular;

  const buildLabel =
    numBuilds !== 1 ? tk.orders.build.plural : tk.orders.build.singular;

  const disbandLabel =
    numDisbands !== 1 ? tk.orders.disband.plural : tk.orders.disband.singular;

  const supplyCentersToWinLabel = `${numSupplyCentersToWin} to win`;

  const nationLabel = nation.isUser ? `${nation.name} (You)` : nation.name;

  return (
    <div className={classes.root} title={`${nation.name} summary`}>
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
          {typeof numBuilds === "number" && (
            <Typography variant="body2">
              {numBuilds} {buildLabel}
            </Typography>
          )}
          {typeof numDisbands === "number" && (
            <Typography variant="body2">
              {numDisbands} {disbandLabel}
            </Typography>
          )}
        </div>
      </div>
      <div className={classes.nationStatus}>
        {confirmedOrders && (
          <Tooltip title={tk.orders.confirmedIconTooltip}>
            <OrdersConfirmedIcon />
          </Tooltip>
        )}
        {wantsDraw && (
          <Tooltip title={tk.orders.wantsDrawIconTooltip}>
            <WantsDrawIcon />
          </Tooltip>
        )}
        {noOrdersGiven && (
          <Tooltip title={tk.orders.noOrdersGivenIconTooltip}>
            <NoOrdersGivenIcon />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default NationSummary;
