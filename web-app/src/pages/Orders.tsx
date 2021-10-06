/* eslint-disable no-restricted-globals */
import React, { useState } from "react";
import {
  Button,
  FormControlLabel,
  Checkbox,
  Container,
  makeStyles,
  SvgIcon,
  ListItem,
  List,
  ListItemText,
  AppBar,
} from "@material-ui/core";
import { Typography } from "@material-ui/core";

import * as helpers from "../helpers";
import loginBackground from "../static/img/login_background.jpg";
import logo from "../static/img/logo.svg";
import googleIcon from "../static/img/google_icon.svg";
import useRegisterPageView from "../hooks/useRegisterPageview";
import NationSummary from "../components/Orders/NationSummary";
import { WantsDrawIcon } from "../icons";
import Order from "../components/Orders/Order";

const useStyles = makeStyles((theme) => ({
  root: {
    "& li": {
      listStyle: "none",
    },
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
  },
}));

// Nations sorted by user first and then alphabetical
const data = {
  userIsMember: true,
  noOrders: true,
  readyToResolve: true,
  nationStatuses: [
    {
      confirmedOrders: false,
      noOrdersGiven: false,
      numBuilds: 0,
      numDisbands: 0,
      numSupplyCenters: 0,
      numSupplyCentersToWin: 18,
      wantsDraw: false,
      nation: {
        name: "Austria",
        abbreviation: "au",
        color: "#FFF",
        flagLink:
          "https://diplicity-engine.appspot.com/Variant/Classical/Flags/Austria.svg",
        label: "Austria (You)",
        isUser: true,
      },
      orders: [
        {
          label: "Trieste move to Adriatic Sea",
          inconsistencies: ["Doesn't match order for Burgundy"],
          resolution: "Success",
        },
      ],
      homelessInconsistencies: ["You can give 3 orders but have only given 2"],
    },
    {
      confirmedOrders: false,
      noOrdersGiven: false,
      numBuilds: 0,
      numDisbands: 0,
      numSupplyCenters: 0,
      numSupplyCentersToWin: 18,
      wantsDraw: false,
      nation: {
        name: "Germany",
        abbreviation: "ge",
        color: "#FFF",
        flagLink:
          "https://diplicity-engine.appspot.com/Variant/Classical/Flags/Germany.svg",
        label: "Germany",
        isUser: false,
      },
      homelessInconsistencies: [],
      orders: [
        {
          label: "Munich move to Berlin",
          inconsistencies: [],
          resolution: "Success",
        },
        {
          label: "Kiel move to Denmark",
          inconsistencies: [],
          resolution: "Fails",
        },
      ],
    },
  ],
};

const TOGGLE_DIAS_LABEL = "Accept draw";
const CONFIRM_ORDERS_LABEL = "Confirm orders";
const NO_ORDERS_LABEL = "You have no orders to give this turn";
const CONFIRM_ORDERS_PROMPT = "When you're ready for the next turn";

const Orders = () => {
  useRegisterPageView("Orders");
  const classes = useStyles();
  const { nationStatuses, userIsMember, noOrders, readyToResolve } = data;

  const toggleDias = () => {};

  return (
    <div>
      <Container maxWidth="lg" className={classes.root}>
        <div className={classes.nationSummaryList}>
          {nationStatuses.map((nationStatus) => (
            <div>
              <div className={classes.nationSummaryContainer}>
                <NationSummary
                  nation={nationStatus.nation}
                  confirmedOrders={nationStatus.confirmedOrders}
                  noOrdersGiven={nationStatus.noOrdersGiven}
                  numBuilds={nationStatus.numBuilds}
                  numSupplyCenters={nationStatus.numSupplyCenters}
                  numSupplyCentersToWin={nationStatus.numSupplyCentersToWin}
                  numDisbands={nationStatus.numDisbands}
                  wantsDraw={nationStatus.wantsDraw}
                />
                {nationStatus.nation.isUser && (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={toggleDias}
                  >
                    <Checkbox
                      checked={nationStatus.wantsDraw}
                      color="primary"
                    />
                    {TOGGLE_DIAS_LABEL}
                    <SvgIcon>
                      <WantsDrawIcon />
                    </SvgIcon>
                  </Button>
                )}
              </div>
              <ul className={classes.ordersList}>
                {nationStatus.orders.map((order) => (
                  <li>
                    <Order order={order} />
                  </li>
                ))}
              </ul>
              <ul className={classes.homelessInconsistenciesList}>
                {nationStatus.homelessInconsistencies.map((inconsistency) => (
                  <li>
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
          >
            <Checkbox disabled={noOrders} checked={readyToResolve} />
            {CONFIRM_ORDERS_LABEL}
          </Button>
          <Typography variant="caption">
            {noOrders ? NO_ORDERS_LABEL : CONFIRM_ORDERS_PROMPT}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Orders;
