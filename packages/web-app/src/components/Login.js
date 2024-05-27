/* eslint-disable no-restricted-globals */
import React from "react";
import { Button, FormControlLabel, Checkbox } from "@material-ui/core";
import gtag from "ga-gtag";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import * as helpers from "../helpers";
import Globals from "../Globals";
import loginBackground from "../static/img/login_background.jpg";
import logo from "../static/img/logo.svg";
import googleIcon from "../static/img/google_icon.svg";
import NewsDialog from "./NewsDialog";

const styles = (theme) => ({
  label: {
    color: "white",
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stayLoggedIn: false,
    };
  }
  componentDidMount() {
    gtag("set", { page_title: "Login", page_location: location.href });
    gtag("event", "page_view");
  }
  render() {
    const { classes } = this.props;

    if (Globals.loginURL) {
      return (
        <div
          style={{
            background: `url("${loginBackground}") no-repeat bottom center fixed`,
            backgroundSize: "cover",
            fontWeight: 400,
            fontFamily: '"Cabin", sans-serif',
            backgroundColor: "#fde2b5",
            margin: "0px",
            height: "100vh",
          }}
        >
          <div
            style={{
              alignContent: "center",
              maxWidth: "940px",
              height: "calc(100% - 2px)",
              margin: "auto",
            }}
          >
            <NewsDialog />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                alignContent: "flex-end",
                justifyContent: "center",
                flexWrap: "wrap",
                height: "calc(100% - 32px)",
                maxWidth: "340px",
                padding: "16px",
              }}
            >
              <div>
                <img
                  alt="Diplicity logo"
                  style={{
                    alignSelf: "left",
                    width: "100%",
                    maxWidth: "340px",
                    padding: "0px",
                    margin: "0px",
                    marginBottom: "4px",
                  }}
                  src={logo}
                />
              </div>
              <div
                style={{
                  color: "white",
                  fontFamily: "cabin",
                  textAlign: "left",
                  width: "100%",
                  lineHeight: "1.4",
                }}
              >
                <Typography>
                  A digital version of the classic game of Diplomacy. Sign in to
                  play.
                </Typography>
              </div>
              <div
                style={{
                  marginTop: "24px",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "white",
                    color: "#757575",
                    width: "220px",
                    textTransform: "initial",
                    fontFamily: '"cabin", sans-serif',
                  }}
                  onClick={(_) => {
                    helpers.login(
                      this.state.stayLoggedIn
                        ? 60 * 60 * 24 * 365 * 100
                        : 60 * 60 * 20
                    );
                  }}
                  startIcon={
                    <i>
                      <img alt="Google icon" src={googleIcon} />{" "}
                    </i>
                  }
                >
                  Sign in with Google
                </Button>
                {window.Wrapper ? (
                  ""
                ) : (
                  <FormControlLabel
                    classes={{
                      label: classes.label,
                    }}
                    control={
                      <Checkbox
                        style={{ color: "white" }}
                        checked={this.state.stayLoggedIn}
                        onChange={(ev) => {
                          this.setState({
                            stayLoggedIn: ev.target.checked,
                          });
                        }}
                      />
                    }
                    label="Stay logged in"
                  />
                )}
              </div>
              <div
                style={{
                  margin: "24px calc(50% - 40px)",
                  visibility: "hidden",
                }}
              ></div>
            </div>
          </div>
        </div>
      );
    } else {
      return "";
    }
  }
}

export default withStyles(styles, { withTheme: true })(Login);
