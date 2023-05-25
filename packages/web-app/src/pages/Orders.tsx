import React from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import {
  DiplicityError,
  translateKeys as tk,
  useOrders,
} from "@diplicity/common";
import { useTranslation } from "react-i18next";
import { CheckBoxIconChecked, CheckBoxIconUnchecked } from "../icons";
import PhaseSelector from "../components/PhaseSelector";
import Order from "../components/Order";
import NationSummary from "../components/NationSummary";

interface OrdersUrlParams {
  gameId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "calc(100% - 48px)", // TODO remove hard coding
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "& li": {
      listStyle: "none",
    },
  },
  phaseSelectorContainer: {
    display: "flex",
    justifyContent: "center",
  },
  container: {
    paddingTop: theme.spacing(2),
  },
  nationSummaryList: {
    "& > li": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  nationSummaryContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  ordersList: {
    width: "100%",
    padding: 0,
    "& > li": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  homelessInconsistenciesList: {
    padding: "0",
    color: theme.palette.error.main,
  },
  bottomBar: {
    padding: theme.spacing(2, 6),
    position: "sticky",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    bottom: "0px",
    zIndex: 1201,
  },
  confirmOrdersButton: {
    padding: theme.spacing(1, 2),
    gap: theme.spacing(1),
  },
}));

const Orders = () => {
  const { t } = useTranslation();
  // useRegisterPageView("Orders");
  // useSelectPhaseQuerystringParams();
  const { gameId } = useParams<OrdersUrlParams>();
  const classes = useStyles();
  const {
    isLoading,
    isError,
    error,
    nationStatuses,
    noOrders,
    ordersConfirmed,
    phaseStateIsLoading,
    isCurrentPhase,
    toggleAcceptDraw,
    toggleConfirmOrders,
    userIsMember,
  } = useOrders(gameId);

  if (isError) return <ErrorMessage error={error as DiplicityError} />;
  if (isLoading) return <Loading />;

  return (
    <div className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.phaseSelectorContainer}>
          <PhaseSelector />
        </div>
        <div className={classes.nationSummaryList}>
          {nationStatuses.map((nationStatus) => (
            <div key={nationStatus.nation.name}>
              <div className={classes.nationSummaryContainer}>
                <NationSummary nationStatus={nationStatus} />
                {nationStatus.nation.isUser && isCurrentPhase && (
                  <FormControlLabel
                    label={t(tk.orders.toggleDiasButton.label) as string}
                    control={
                      <Checkbox
                        checked={nationStatus.wantsDraw}
                        color="primary"
                        disabled={phaseStateIsLoading}
                        onClick={toggleAcceptDraw}
                      />
                    }
                  />
                )}
              </div>
              <ul className={classes.ordersList}>
                {nationStatus.orders.map((order) => (
                  <li key={order.label}>
                    <Order order={order} />
                  </li>
                ))}
              </ul>
              <ul className={classes.homelessInconsistenciesList}>
                {nationStatus.homelessInconsistencies.map((inconsistency) => (
                  <li key={inconsistency}>
                    <Typography>{inconsistency}</Typography>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      {userIsMember && (
        <div className={classes.bottomBar}>
          <Button
            color="secondary"
            variant="contained"
            className={classes.confirmOrdersButton}
            title={t(tk.orders.confirmOrdersButton.label)}
            disabled={phaseStateIsLoading || noOrders}
            onClick={toggleConfirmOrders}
          >
            {ordersConfirmed || noOrders ? (
              <CheckBoxIconChecked data-testid="confirm-orders-checked" />
            ) : (
              <CheckBoxIconUnchecked data-testid="confirm-orders-unchecked" />
            )}
            {t(tk.orders.confirmOrdersButton.label)}
          </Button>
          <Typography variant="caption">
            {t(
              noOrders
                ? tk.orders.confirmOrdersButton.noOrders
                : tk.orders.confirmOrdersButton.prompt
            )}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Orders;
