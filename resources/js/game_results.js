import * as helpers from '%{ cb "/js/helpers.js" }%';

import NationAvatar from '%{ cb "/js/nation_avatar.js"}%';

export default class GameResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, gameResult: null, trueSkills: null };
    this.member = this.props.game.Properties.Members.find((e) => {
      return e.User.Email == Globals.user.Email;
    });
    if (this.props.parentCB) {
      this.props.parentCB(this);
    }
    this.close = this.close.bind(this);
  }
  close() {
    this.setState({ open: false });
  }
  componentDidMount() {
    let gameResultLink = this.props.game.Links.find((l) => {
      return l.Rel == "game-result";
    });
    if (gameResultLink) {
      helpers.incProgress();
      helpers
        .safeFetch(helpers.createRequest(gameResultLink.URL))
        .then((res) => res.json())
        .then((gameResultJS) => {
          helpers
            .safeFetch(
              helpers.createRequest(
                gameResultJS.Links.find((l) => {
                  return l.Rel == "true-skills";
                }).URL
              )
            )
            .then((res) => res.json())
            .then((trueSkillsJS) => {
              helpers.decProgress();
              this.setState({
                gameResult: gameResultJS,
                trueSkills: trueSkillsJS,
              });
            });
        });
    }
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
        <MaterialUI.DialogTitle>Game result</MaterialUI.DialogTitle>
        <MaterialUI.DialogContent style={{paddingBottom:"0px"}}>
          <MaterialUI.Typography>
            This is the end-game points based on the{" "}
            <a href="http://windycityweasels.org/tribute-scoring-system/">
              Tribute
            </a>{" "}
            system.
          </MaterialUI.Typography>
          <MaterialUI.List>
            {this.state.gameResult
              ? this.props.variant.Properties.Nations.slice()
                  .sort((n1, n2) => {
                    if (this.member && n1 == this.member.Nation) {
                      return -1;
                    } else if (this.member && n2 == this.member.Nation) {
                      return 1;
                    } else {
                      if (n1 < n2) {
                        return -1;
                      } else if (n2 < n1) {
                        return 1;
                      } else {
                        return 0;
                      }
                    }
                  })
                  .map((nation) => {
                    const score = this.state.gameResult.Properties.Scores.find(
                      (s) => {
                        return s.Member == nation;
                      }
                    );
                    const trueSkill = this.state.trueSkills.Properties.find(
                      (l) => {
                        return l.Properties.Member == nation;
                      }
                    );
                    return (
                      <MaterialUI.ListItem
                        key={"nation_" + nation}
                        style={{ padding: "0px", margin: "0px" }}
                      >
                        <MaterialUI.ExpansionPanel
                          square
                          style={{
                            padding: "0px",
                            margin: "0px",
                            boxShadow: "none",
                            width: "100%",
                          }}
                        >
                          <MaterialUI.ExpansionPanelSummary
                            style={{
                              padding: "0px",
                              margin: "0px",
                              boxShadow: "none",
                            }}
                            expandIcon={helpers.createIcon("\ue5cf")}
                          >
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: "0px 0px",
                                margin: "0px",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                width: "100%",
                                color: "rgba(40, 26, 26, 0.54)",
                              }}
                            >
                              <NationAvatar
                                nation={nation}
                                className={helpers.avatarClass}
                                variant={this.props.variant}
                              />
                              <div
                                style={{
                                  marginLeft: "8px",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <MaterialUI.Typography
                                  variant="subtitle2"
                                  color="primary"
                                >
                                  {nation}
                                </MaterialUI.Typography>
                                {this.state.gameResult.Properties
                                  .SoloWinnerMember == nation ? (
                                  <MaterialUI.Typography
                                    variant="caption"
                                    key="solo-winner"
                                  >
                                    Solo winner
                                  </MaterialUI.Typography>
                                ) : (
                                  ""
                                )}
                                {this.state.gameResult.Properties
                                  .SoloWinnerMember == "" &&
                                (
                                  this.state.gameResult.Properties
                                    .DIASMembers || []
                                ).indexOf(nation) != -1 ? (
                                  <MaterialUI.Typography
                                    variant="caption"
                                    key="dias-member"
                                  >
                                    Draw participant
                                  </MaterialUI.Typography>
                                ) : (
                                  ""
                                )}
                                {(
                                  this.state.gameResult.Properties
                                    .EliminatedMembers || []
                                ).indexOf(nation) != -1 ? (
                                  <MaterialUI.Typography
                                    variant="caption"
                                    key="eliminated-member"
                                  >
                                    Eliminated
                                  </MaterialUI.Typography>
                                ) : (
                                  ""
                                )}
                                {(
                                  this.state.gameResult.Properties.NMRMembers ||
                                  []
                                ).indexOf(nation) != -1 ? (
                                  <MaterialUI.Typography
                                    variant="caption"
                                    key="nmr-member"
                                  >
                                    Abandoned the game
                                  </MaterialUI.Typography>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div
                                style={{
                                  marginLeft: "8px",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignSelf: "flex-end",
                                  marginLeft: "auto",
                                }}
                              >
                                <MaterialUI.Typography
                                  variant="subtitle2"
                                  color="primary"
                                  style={{ textAlign: "right" }}
                                >
                                  {helpers.twoDecimals(score.Score)} points
                                </MaterialUI.Typography>
                                <MaterialUI.Typography
                                  variant="caption"
                                  style={{ textAlign: "right" }}
                                >
                                  {score.SCs} SCs{" "}
                                </MaterialUI.Typography>
                              </div>
                            </div>
                          </MaterialUI.ExpansionPanelSummary>

                          <MaterialUI.ExpansionPanelDetails>
                            <div style={{ width: "100%" }}>
                              {score ? (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "0px",
                                    margin: "0px",
                                    width: "100%",
                                  }}
                                >
                                  <div>
                                    {score.Explanation.split("\n")
                                      .filter((l) => {
                                        return l.trim() != "";
                                      })
                                      .map((line) => {
                                        const parts = line.split(":");
                                        return (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              color: "rgba(40, 26, 26,0.3)",
                                            }}
                                            key={line}
                                          >
                                            <MaterialUI.Typography variant="subtitle2">
                                              {parts[0]}
                                            </MaterialUI.Typography>
                                            <MaterialUI.Typography variant="subtitle2">
                                              {helpers.twoDecimals(parts[1])}
                                            </MaterialUI.Typography>
                                          </div>
                                        );
                                      })}

                                    {trueSkill ? (
                                      <div>
                                        <div
                                          style={{
                                            borderTop: "1px solid black",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "0px",
                                            margin: "0px 0px 16px 0px",
                                            width: "100%",
                                          }}
                                        >
                                          <MaterialUI.Typography variant="subtitle2">
                                            Total points
                                          </MaterialUI.Typography>
                                          <MaterialUI.Typography variant="subtitle2">
                                            {helpers.twoDecimals(score.Score)}
                                          </MaterialUI.Typography>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "0px",
                                            margin: "0px",
                                            width: "100%",
                                            color: "rgba(40, 26, 26,0.3)",
                                          }}
                                        >
                                          <MaterialUI.Typography variant="subtitle2">
                                            Previous rating
                                          </MaterialUI.Typography>
                                          <MaterialUI.Typography variant="subtitle2">
                                            {helpers.twoDecimals(
                                              trueSkill.Properties.Previous
                                                .Rating
                                            )}
                                          </MaterialUI.Typography>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "0px",
                                            margin: "0px",
                                            width: "100%",
                                            color: "rgba(40, 26, 26,0.3)",
                                          }}
                                        >
                                          <MaterialUI.Typography variant="subtitle2">
                                            Points vs Predicted	 outcome
                                          </MaterialUI.Typography>
                                          <MaterialUI.Typography variant="subtitle2">
                                            {helpers.twoDecimals(
                                              trueSkill.Properties.Rating -
                                                trueSkill.Properties.Previous
                                                  .Rating
                                            )}
                                          </MaterialUI.Typography>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "0px",
                                            margin: "0px",
                                            width: "100%",
                                          }}
                                        >
                                          <MaterialUI.Typography variant="subtitle2">
                                            New rating
                                          </MaterialUI.Typography>
                                          <MaterialUI.Typography variant="subtitle2">
                                            {helpers.twoDecimals(
                                              trueSkill.Properties.Rating
                                            )}
                                          </MaterialUI.Typography>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          padding: "0px",
                                          margin: "0px",
                                          width: "100%",
                                          backgroundColor: "pink",
                                        }}
                                      >
                                        <div>Sum</div>
                                        <div>
                                          {helpers.twoDecimals(score.Score)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </MaterialUI.ExpansionPanelDetails>
                        </MaterialUI.ExpansionPanel>
                      </MaterialUI.ListItem>
                    );
                  })
              : ""}
          </MaterialUI.List>
          <MaterialUI.DialogActions
            style={{
              backgroundColor: "white",
              position: "sticky",
              bottom: "0px",
            }}
          >
            <MaterialUI.Button onClick={this.close} color="primary">
              Close
            </MaterialUI.Button>
          </MaterialUI.DialogActions>
        </MaterialUI.DialogContent>
      </MaterialUI.Dialog>
    );
  }
}
