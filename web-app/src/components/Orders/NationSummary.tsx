import { Typography, makeStyles, Tooltip } from "@material-ui/core";
import React from "react";
import { NationStatus } from "../../hooks/useOrders";
import {
  NoOrdersGivenIcon,
  OrdersConfirmedIcon,
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

const ORDERS_CONFIRMED_ICON_TITLE = "Confirmed their orders";
const NO_ORDERS_GIVEN_ICON_TITLE = "Did not send orders";
const WANTS_DRAW_ICON_TITLE = "Wants draw";
const SUPPLY_CENTER_LABEL_SINGULAR = "supply center";
const SUPPLY_CENTER_LABEL_PLURAL = "supply centers";
const BUILD_LABEL_SINGULAR = "build";
const BUILD_LABEL_PLURAL = "builds";
const DISBAND_LABEL_SINGULAR = "disband";
const DISBAND_LABEL_PLURAL = "disbands";

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
      ? SUPPLY_CENTER_LABEL_PLURAL
      : SUPPLY_CENTER_LABEL_SINGULAR;

  const buildLabel =
    numBuilds !== 1 ? BUILD_LABEL_PLURAL : BUILD_LABEL_SINGULAR;

  const disbandLabel =
    numDisbands !== 1 ? DISBAND_LABEL_PLURAL : DISBAND_LABEL_SINGULAR;

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
