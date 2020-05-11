import * as helpers from '%{ cb "/js/helpers.js" }%';

import UserAvatar from '%{ cb "/js/user_avatar.js" }%';
import NationAvatar from '%{ cb "/js/nation_avatar.js"}%';

export default class GameMetadata extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      gameStates: (this.props.gameStates || []).reduce((sum, el) => {
        sum[el.Properties.Nation] = el;
        return sum;
      }, {}),
      bans: Globals.bans,
    };
    this.member = this.props.game.Properties.Members.find((e) => {
      return e.User.Email == Globals.user.Email;
    });
    if (this.props.parentCB) {
      this.props.parentCB(this);
    }
    this.close = this.close.bind(this);
    this.toggleMuted = this.toggleMuted.bind(this);
    this.valignClass = helpers.scopedClass(
      "display: flex; align-items: center;"
    );
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.open && this.state.open) {
      gtag("set", { page_title: "GameMetadata", page_location: location.href });
      gtag("event", "page_view");
    }
  }
  toggleBanned(uid) {
    return (_) => {
      if (Globals.bans[uid]) {
        let unsignLink = Globals.bans[uid].Links.find((l) => {
          return l.Rel == "unsign";
        });
        if (unsignLink) {
          helpers.incProgress();
          helpers
            .safeFetch(
              helpers.createRequest(unsignLink.URL, {
                method: unsignLink.Method,
              })
            )
            .then((res) => res.json())
            .then((js) => {
              helpers.decProgress();
              delete Globals.bans[uid];
              this.setState({ bans: Globals.bans });
            });
        }
      } else {
        helpers.incProgress();
        helpers
          .safeFetch(
            helpers.createRequest("/User/" + Globals.user.Id + "/Ban", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                UserIds: [Globals.user.Id, uid],
              }),
            })
          )
          .then((res) => res.json())
          .then((js) => {
            helpers.decProgress();
            Globals.bans[uid] = js;
            this.setState({ bans: Globals.bans });
          });
      }
    };
  }
  toggleMuted(nation) {
    return (_) => {
      let gameState = this.state.gameStates[this.member.Nation];
      if (gameState.Properties.Muted == null) {
        gameState.Properties.Muted = [];
      }
      let idx = gameState.Properties.Muted.indexOf(nation);
      if (idx == -1) {
        gameState.Properties.Muted.push(nation);
      } else {
        gameState.Properties.Muted = gameState.Properties.Muted.slice(
          0,
          idx
        ).concat(gameState.Properties.Muted.slice(idx + 1));
      }
      let updateLink = this.state.gameStates[this.member.Nation].Links.find(
        (l) => {
          return l.Rel == "update";
        }
      );
      helpers.incProgress();
      helpers
        .safeFetch(
          helpers.createRequest(updateLink.URL, {
            headers: {
              "Content-Type": "application/json",
            },
            method: updateLink.Method,
            body: JSON.stringify(gameState.Properties),
          })
        )
        .then((res) => res.json())
        .then((js) => {
          helpers.decProgress();
          this.setState((state, props) => {
            state = Object.assign({}, state);
            state.gameStates[this.member.Nation].Properties = js.Properties;
            return state;
          });
          this.props.onNewGameState(js);
        });
    };
  }
  close() {
    helpers.unback(this.close);
    this.setState({ open: false });
  }
  render() {
    if (this.state.open) {
      return (
        <MaterialUI.Dialog
          onEntered={helpers.genOnback(this.close)}
          open={this.state.open}
          className="find-game-dialog"
          disableBackdropClick={false}
          classes={{
            paper: helpers.scopedClass("margin: 2px; width: 100%;"),
          }}
          onClose={this.close}
        >
          <MaterialUI.DialogTitle>Game metadata</MaterialUI.DialogTitle>
          <MaterialUI.DialogContent>

              {this.state.gameStates
                ? this.props.game.Properties.Members.map((member) => {
                    return (
                      <React.Fragment key={member.Nation + "-fragment"}>
                        <div style={{ display: "flex", width: "100%", flexWrap:"wrap", marginBottom:"12px" }}>
                          <div style={{ width: "40px", height: "40px", marginRight: "8px"}}>
                            <UserAvatar
                              onNewGameState={this.props.onNewGameState}
                              game={this.props.game}
                              gameState={
                                this.member
                                  ? this.state.gameStates[this.member.Nation]
                                  : null
                              }
                              banChange={(_) => {
                                this.forceUpdate();
                              }}
                              user={member.User}
                            />
                          </div>

                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <MaterialUI.Typography variant="body1">
                              {member.User.Name}
                            </MaterialUI.Typography>
                            <MaterialUI.Typography variant="subtitle2">
                              {member.Nation}
                            </MaterialUI.Typography>
                          </div>

                          <div style={{marginLeft:"auto", display:"flex", paddingLeft: "8px"}}>
                            <MaterialUI.FormControlLabel
                              control={
                                <MaterialUI.Checkbox
                                  disabled={member.User.Id == Globals.user.Id}
                                  checked={!!this.state.bans[member.User.Id]}
                                  onChange={this.toggleBanned(member.User.Id)}
                                />
                              }
                              label="Ban"
                            />

                            <MaterialUI.FormControlLabel
                              control={
                                <MaterialUI.Checkbox
                                  disabled={
                                    !this.member ||
                                    member.Nation == this.member.Nation
                                  }
                                  checked={
                                    this.member &&
                                    (
                                      this.state.gameStates[this.member.Nation]
                                        .Properties.Muted || []
                                    ).indexOf(member.Nation) != -1
                                  }
                                  onChange={this.toggleMuted(member.Nation)}
                                />
                              }
                              label="Mute"
                              style={{marginRigh:"0px"}}
                            />
                          </div>
                        </div>

               
                      </React.Fragment>
                    );
                  })
                : ""}

            <MaterialUI.DialogActions
              className={helpers.scopedClass(
                "background-color: white; position: sticky; bottom: -8px;"
              )}
            >
              <MaterialUI.Button onClick={this.close} color="primary">
                Close
              </MaterialUI.Button>
            </MaterialUI.DialogActions>
          </MaterialUI.DialogContent>
        </MaterialUI.Dialog>
      );
    } else {
      return "";
    }
  }
}
