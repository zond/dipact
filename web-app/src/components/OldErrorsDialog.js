/* eslint-disable no-restricted-globals */
import React from "react";
import gtag from "ga-gtag";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import withStyles from '@mui/styles/withStyles';

import * as helpers from "../helpers";

const styles = (theme) => ({
	dialogAction: {
		backgroundColor: "white",
		position: "sticky",
		bottom: "0px",
	},
	paper: {
		margin: "2px",
		width: "100%",
	},
});

class ErrorsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, errors: [] };
    this.close = this.close.bind(this);
    if (this.props.parentCB) {
      this.props.parentCB(this);
    }
    this.errors = null;
  }
  close() {
    helpers.unback(this.close);
    this.setState({ open: false });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.open && this.state.open) {
      gtag("set", {
        page_title: "ErrorsDialog",
        page_location: location.href,
      });
      gtag("event", "page_view");
      const jsonErrors = localStorage.getItem("errors");
      const errors = (jsonErrors ? JSON.parse(jsonErrors) : []).map((el) => {
        el.at = new Date(el.at);
        return el;
      });
      this.setState({ errors: errors });
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <Dialog
        classes={{
          paper: classes.paper,
        }}
        open={this.state.open}
        onClose={this.close}
        TransitionProps={{
          onEntered: helpers.genOnback(this.close)
        }}>
        <DialogTitle>Bug report info</DialogTitle>
        <DialogContent>
        <Typography>
        If you find a bug, please report it on <a href="https://discord.com/invite/bu3JxYc" target="_blank">Chat</a> or <a href="https://groups.google.com/g/diplicity-talk" target="_blank">the Forum</a>.
        <br />
        Below are error codes you can report to the developers. Click on one to copy it to Clipboard.
        </Typography >
          {this.state.errors.length > 0 ? (
            <List>
              {this.state.errors.map((el, idx) => {
                return (
                  <ListItem key={idx}>
                    <Button
                      style={{ textTransform: "none" }}
                      variant="outlined"
                      onClick={(_) => {
                        helpers.copyToClipboard(JSON.stringify(el)).then(
                          (_) => {
                            helpers.snackbar("Error copied to clipboard");
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      }}
                    >
                      {el.message}
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <p>No errors found.</p>
          )}
          <DialogActions
            className={classes.dialogAction}
          >
            <Button onClick={this.close} color="primary">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ErrorsDialog);
