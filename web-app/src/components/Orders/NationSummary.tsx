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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("common");
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

  const supplyCenterCountLabel =
    numSupplyCenters !== 1
      ? tk.orders.supplyCenterCount.plural
      : tk.orders.supplyCenterCount.singular;

  const buildCountLabel =
    numBuilds !== 1
      ? tk.orders.buildCount.plural
      : tk.orders.buildCount.singular;

  const disbandCountLabel =
    numDisbands !== 1
      ? tk.orders.disbandCount.plural
      : tk.orders.disbandCount.singular;

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
            {t(supplyCenterCountLabel, { count: numSupplyCenters })}
          </Typography>
          {nation.isUser && (
            <Typography variant="body2">({supplyCentersToWinLabel})</Typography>
          )}
          {typeof numBuilds === "number" && (
            <Typography variant="body2">
              {t(buildCountLabel, { count: numBuilds })}
            </Typography>
          )}
          {typeof numDisbands === "number" && (
            <Typography variant="body2">
              {t(disbandCountLabel, { count: numDisbands })}
            </Typography>
          )}
        </div>
      </div>
      <div className={classes.nationStatus}>
        {confirmedOrders && (
          <Tooltip title={t(tk.orders.confirmedIconTooltip) as string}>
            <OrdersConfirmedIcon />
          </Tooltip>
        )}
        {wantsDraw && (
          <Tooltip title={t(tk.orders.wantsDrawIconTooltip) as string}>
            <WantsDrawIcon />
          </Tooltip>
        )}
        {noOrdersGiven && (
          <Tooltip title={t(tk.orders.noOrdersGivenIconTooltip) as string}>
            <NoOrdersGivenIcon />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default NationSummary;
