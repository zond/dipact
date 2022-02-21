/* eslint-disable no-restricted-globals */
import React, { useState } from "react";
import { Button, FormControlLabel, Checkbox, Container } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";

import * as helpers from "../helpers";
import loginBackground from "../static/img/login_background.jpg";
import logo from "../static/img/logo.svg";
import googleIcon from "../static/img/google_icon.svg";
import useRegisterPageView from "../hooks/useRegisterPageview";
import { useTranslation } from "react-i18next";
import { translateKeys as tk } from "@diplicity/common";

const useStyles = makeStyles((theme) => ({
  root: {
    background: `url("${loginBackground}") no-repeat bottom center fixed`,
    backgroundSize: "cover",
    height: "100vh",
    color: theme.palette.background.paper,
    "& > div": {
      height: "100%",
      display: "flex",
      paddingBottom: theme.spacing(4),
      "& > div": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        marginLeft: 0,
        padding: theme.spacing(3),
        gap: theme.spacing(2),
      },
    },
  },
  buttonContainer: {
    display: "flex",
    gap: theme.spacing(1),
    "& > button": {
      backgroundColor: theme.palette.background.paper,
      width: "100%",
      textTransform: "initial",
    },
  },
  formControl: {
    width: "100%",
  },
  label: {
    color: "white",
  },
}));

const TWENTY_HOURS = 60 * 60 * 20;
const HUNDRED_YEARS = 60 * 60 * 24 * 365 * 100;

const Login = () => {
  const { t } = useTranslation();
  useRegisterPageView("Login");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const classes = useStyles();

  const getTokenDuration = () => (stayLoggedIn ? HUNDRED_YEARS : TWENTY_HOURS);

  const onChangeStayLoggedIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStayLoggedIn(e.target.checked);
  };

  const onClickLogin = (e: React.MouseEvent) => {
    helpers.login(getTokenDuration());
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Container maxWidth="xs">
          <div>
            <img alt="Diplicity logo" src={logo} />
          </div>
          <div>
            <Typography>{t(tk.login.description)}</Typography>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              onClick={onClickLogin}
              startIcon={
                <i>
                  <img alt="Google icon" src={googleIcon} />
                </i>
              }
            >
              <Typography>{t(tk.login.loginButton.label)}</Typography>
            </Button>
            {!window.Wrapper && (
              <FormControlLabel
                className={classes.formControl}
                classes={{
                  label: classes.label,
                }}
                control={
                  <Checkbox
                    className={classes.label}
                    checked={stayLoggedIn}
                    onChange={onChangeStayLoggedIn}
                  />
                }
                label={t(tk.login.stayLoggedInCheckBox.label) as string}
              />
            )}
          </div>
        </Container>
      </Container>
    </div>
  );
};

export default Login;
