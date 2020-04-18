import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class SettingsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      config: null,
    };
    if (this.props.parentCB) {
      this.props.parentCB(this);
    }
    this.close = this.close.bind(this);
    this.updatePhaseDeadline = this.updatePhaseDeadline.bind(this);
    this.saveConfig = this.saveConfig.bind(this);
  }
  close() {
    this.setState({ open: false });
  }
  saveConfig() {
    this.state.config.Properties.PhaseDeadlineWarningMinutesAhead = Number.parseInt(
      this.state.config.Properties.PhaseDeadlineWarningMinutesAhead || "0"
    );
    let updateLink = this.state.config.Links.find((l) => {
      return l.Rel == "update";
    });
    helpers.incProgress();
    helpers
      .safeFetch(
        helpers.createRequest(updateLink.URL, {
          method: updateLink.Method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.config.Properties),
        })
      )
      .then((resp) => resp.json())
      .then((js) => {
        helpers.decProgress();
        this.setState((state, props) => {
          state = Object.assign({}, state);
          state.config = js;
          return state;
        });
      });
  }
  updatePhaseDeadline(ev) {
    ev.persist();
    this.setState(
      (state, props) => {
        state = Object.assign({}, state);
        let newValue = ev.target.value;
        if (newValue != "") {
          newValue = Number.parseInt(newValue);
        }
        state.config.Properties.PhaseDeadlineWarningMinutesAhead = newValue;
        if (!state.config.Properties.FCMTokens) {
          state.config.Properties.FCMTokens = [];
        }
        return state;
      },
      (_) => {}
    );
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.open == this.state.open || !this.state.open) {
      return;
    }
    helpers.incProgress();
    helpers
      .safeFetch(
        helpers.createRequest("/User/" + Globals.user.Id + "/UserConfig")
      )
      .then((resp) => resp.json())
      .then((js) => {
        helpers.decProgress();
        this.setState({ config: js });
      });
  }
  render() {
    return (
      <MaterialUI.Dialog
        open={this.state.open}
        disableBackdropClick={false}
        classes={{
          paper: helpers.scopedClass("margin: 2px; width: 100%;"),
        }}
        onClose={this.close}
      >
        <MaterialUI.DialogTitle>Notifications</MaterialUI.DialogTitle>
        <MaterialUI.DialogContent>
          {this.state.config ? (
            <React.Fragment>
              <div width="100%">
                <MaterialUI.FormControlLabel
                  control={
                    <MaterialUI.Switch
                      checked={Globals.messaging.tokenEnabled}
                      disabled={Globals.messaging.hasPermission ? false : true}
                      onChange={(ev) => {
                        const wantedState = ev.target.checked;
                        helpers.incProgress();
                        Globals.messaging.start().then((js) => {
                          helpers.decProgress();
                          let currentConfig = this.state.config;
                          if (js) {
                            currentConfig = js;
                          }
                          this.setState(
                            (state, props) => {
                              state = Object.assign({}, state);
                              state.config = currentConfig;
                              return state;
                            },
                            (_) => {
                              if (Globals.messaging.tokenOnServer) {
                                if (
                                  Globals.messaging.tokenEnabled != wantedState
                                ) {
                                  Globals.messaging.targetState = wantedState
                                    ? "enabled"
                                    : "disabled";
                                  helpers.incProgress();
                                  Globals.messaging
                                    .refreshToken()
                                    .then((js) => {
                                      helpers.decProgress();
                                      this.setState({
                                        config: js,
                                      });
                                    });
                                } else {
                                  this.forceUpdate();
                                }
                              } else {
                                this.forceUpdate();
                              }
                            }
                          );
                        });
                      }}
                    />
                  }
                  label="Push notifications"
                />
                {Globals.messaging.started ? (
                  Globals.messaging.hasPermission ? (
                    Globals.messaging.tokenOnServer ? (
                      Globals.messaging.tokenEnabled ? (
                        ""
                      ) : (
""
                      )
                    ) : (
                        <p style={{ marginTop: "2px" }}>
                          <MaterialUI.Typography variant="caption">
                            Notifications disabled [Error: no token uploaded]
                          </MaterialUI.Typography>
                        </p>   
                 )
                  ) : (
                                           <p style={{ marginTop: "2px" }}>
                          <MaterialUI.Typography variant="caption">
                            No notification permission received.<br /><a href="https://www.google.com/search?q=reset+browser+permission+notifications&rlz=1C5CHFA_enNL775NL775&oq=reset+browser+permission+notifications&aqs=chrome..69i57j69i60l2.3519j1j4&sourceid=chrome&ie=UTF-8" target="_blank">Allow this sites notifications in your browser settings.</a>
                          </MaterialUI.Typography>
                        </p>   
                  )
                ) : (
                                          <p style={{ marginTop: "2px" }}>
                          <MaterialUI.Typography variant="caption">
                            Notification disabled [Error: notification system did not start]
                          </MaterialUI.Typography>
                        </p>   
                )}
              </div>
              <MaterialUI.FormControlLabel
                control={
                  <MaterialUI.Switch
                    checked={this.state.config.Properties.MailConfig.Enabled}
                    onChange={(ev) => {
                      ev.persist();
                      this.setState((state, props) => {
                        state = Object.assign({}, state);
                        state.config.Properties.MailConfig.Enabled =
                          ev.target.checked;
                        let hrefURL = new URL(window.location.href);
                        state.config.Properties.MailConfig.MessageConfig.TextBodyTemplate =
                          "{{message.Body}}\n\nVisit {{unsubscribeURL}} to stop receiving email like this.\n\nVisit " +
                          hrefURL.protocol +
                          "//" +
                          hrefURL.host +
                          "/Game/{{game.ID.Encode}}  to see the latest phase in this game.";
                        state.config.Properties.MailConfig.PhaseConfig.TextBodyTemplate =
                          "{{game.Desc}} has a new phase: " +
                          hrefURL.protocol +
                          "//" +
                          hrefURL.host +
                          "/Game/{{game.ID.Encode}}.\n\nVisit %s to stop receiving email like this.";
                        return state;
                      }, this.saveConfig);
                    }}
                  />
                }
                label="Email notifications"
              />

                <MaterialUI.TextField
                fullWidth
                label="Phase deadline alarm (minutes)"
                margin="dense"
                value={
                  this.state.config.Properties.PhaseDeadlineWarningMinutesAhead
                }
                onChange={this.updatePhaseDeadline}
                onBlur={this.saveConfig}
              />

            </React.Fragment>
          ) : (
            ""
          )}
          <MaterialUI.DialogActions>
            <MaterialUI.Button onClick={this.close} color="primary">
              Close
            </MaterialUI.Button>
          </MaterialUI.DialogActions>
        </MaterialUI.DialogContent>
      </MaterialUI.Dialog>
    );
  }
}
