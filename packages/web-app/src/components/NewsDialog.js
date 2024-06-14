/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import {
  Dialog,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Icon,
} from "@material-ui/core";
import { CloseIcon, WarningIcon } from "../icons";
//import ColdWarPath from "../static/img/coldwar.png";
import colorModePath from "../static/img/colourmode.png";

export default class NewsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      activeItem: 0,
      newsItems: [
        {
          header: "Please read: Diplicity is ending support for Android",
          subheader:
            "Diplicity will be removed from the Google Play Store on August 31, 2024",
          icon: true,
          content: (
            <React.Fragment>
              <Typography variant="h6" style={{ margin: "0px 0px 8px 0px" }}>
                Please read: Diplicity is ending support for Android
              </Typography>
              <Typography variant="body2" paragraph>
                Diplicity will be removed from the Google Play Store on August
                31, 2024. The app will continue to work for existing users, but
                no further updates will be released. The web version of
                Diplicity will continue to be available.
              </Typography>
              <Typography variant="body2" paragraph>
                Diplicity has been a pet project maintained for free by a small
                group of people for a few years. The performance of the Android
                version has degraded over time, and we feel that the app is not
                a good representation of the effort we have put in to date.
              </Typography>
              <Typography variant="body2" paragraph>
                Please continue to enjoy Diplicity on the web, and thank you for
                your support.
              </Typography>
            </React.Fragment>
          ),
        },
      ],
    };
    this.close = this.close.bind(this);
  }
  close() {
    helpers.unback(this.close);
    this.setState({ open: false });
  }
  render() {
    if (this.state.open) {
      return (
        <Dialog
          onEntered={helpers.genOnback(this.close)}
          open={this.state.open}
          fullScreen
          onClose={this.close}
        >
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={(_) => {
                  this.setState({ open: false });
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={{ paddingLeft: "16px" }}>
                News
              </Typography>
            </Toolbar>
          </AppBar>
          <div
            style={{
              padding: "0x",
              margin: "0px",
              maxWidth: "940px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              style={{
                padding: "16px",
                marginTop: "56px",
              }}
            >
              {this.state.newsItems.map((item, idx) => {
                return (
                  <React.Fragment key={idx}>
                    {item.content}
                    <Divider style={{ margin: "16px 0 12px 0" }} />
                  </React.Fragment>
                );
              })}
            </div>
            <div
              style={{
                backgroundImage: "url('../static/img/soldiers.svg'",
                height: "72px",
                top: "auto",
                bottom: "0px",
              }}
            ></div>
          </div>
        </Dialog>
      );
    } else {
      return (
        <div
          style={{
            height: "52px",
            margin: "0px auto 6px auto",
            maxWidth: "940px",
          }}
        >
          {/* Warning icon */}
          <div
            style={{
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              padding: "6px 8px",
              margin: "8px 16px 0px 16px",
              backgroundColor: "#ff9a9a",
              border: "1px solid red",
              backgroundSize: "cover",
              backgroundImage: this.state.newsItems[this.state.activeItem]
                .background
                ? "url(" +
                  this.state.newsItems[this.state.activeItem].background +
                  ")"
                : null,
            }}
            onClick={(_) => {
              this.setState({ open: true });
            }}
          >
            <Icon
              style={{
                color: "red",
                fontSize: "20px",
                padding: "16px",
                flexGrow: 1,
              }}
            >
              <WarningIcon />
            </Icon>
            <div style={{ width: "calc(100% - 48px)" }}>
              <Typography
                variant="body1"
                style={{
                  color: "rgb(97, 26, 21)",
                  fontWeight: "500",
                }}
                textoverflow="ellipsis"
                noWrap
              >
                {this.state.newsItems[this.state.activeItem].header}
              </Typography>

              <Typography
                variant="body2"
                style={{ color: "rgb(97, 26, 21)" }}
                textoverflow="ellipsis"
                noWrap
              >
                {this.state.newsItems[this.state.activeItem].subheader}
              </Typography>
            </div>
          </div>
        </div>
      );
    }
  }
}
