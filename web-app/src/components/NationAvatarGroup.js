import React from "react";

import NationAvatar from "./NationAvatar";
import { Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  groupContainer: {
    backgroundColor: "rgba(40, 26, 26, 1)",
    width: "40px",
    borderRadius: "100px",
    clipPath: "circle(50% at 50% 50%)",
  },
  avatarRow1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(40px)",
    width: "40px",
  },
  avatarRow2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(40px)",
    width: "60px",
    marginLeft: "-10px",
  },
  avatarRow34: {
    display: "flex",
    justifyContent: "center",
    height: "calc(40px / 2)",
    width: "40px",
  },
  avatarRow59: {
    display: "flex",
    justifyContent: "center",
    height: "calc(39px / 3)",
    width: "39px",
  },
  avatar1: {
    height: "calc(36px) !important",
    width: "calc(36px) !important",
  },
  avatar2: {
    height: "calc(40px / 1.5) !important",
    width: "calc(40px / 1.5) !important",
  },
  avatar34: {
    height: "calc(40px / 2) !important",
    width: "calc(40px / 2) !important",
  },
  avatar59: {
    height: "calc(39px / 3) !important",
    width: "calc(39px / 3) !important",
    flexBasis: "1",
  },
});

/*
 * See NationAvatar, but with nations as an array instead of a single nation.
 */
class NationAvatarGroup extends React.Component {
  constructor(props) {
    super(props);
    this.natAv = this.natAv.bind(this);
  }
  natAv(nation, className) {
    return (
      <NationAvatar
        key={nation}
        gameState={this.props.gameState}
        onNewGameState={this.props.onNewGameState}
        game={this.props.game}
        nation={nation}
        variant={this.props.variant}
        classes={{ root: className }}
      />
    );
  }
  render() {
	  const { classes } = this.props;
    if (
      this.props.nations.length === this.props.variant.Properties.Nations.length
    ) {
      return (
        <div className={classes.groupContainer} style={{ backgroundColor: "unset" }}>
          <div className={classes.avatarRow1}>
            <Avatar
              style={{ border: "none" }}
              classes={{ root: classes.avatar1 }}
              key="Everyone"
              alt="Everyone"
              src="/static/img/un_logo.svg"
            />
          </div>
        </div>
      );
    } else if (this.props.nations.length === 1) {
      return (
        <div className={classes.groupContainer}>
          <div className={classes.avatarRow1}>
            {this.natAv(this.props.nations[0], classes.avatar1)}
          </div>
        </div>
      );
    } else if (this.props.nations.length === 2) {
      return (
        <div className={classes.groupContainer}>
          <div className={classes.avatarRow2}>
            {this.natAv(this.props.nations[0], classes.avatar2)}
            {this.natAv(this.props.nations[1], classes.avatar2)}
          </div>
        </div>
      );
    } else if (this.props.nations.length < 5) {
      return (
        <div className={classes.groupContainer}>
          <div className={classes.avatarRow34}>
            {this.natAv(this.props.nations[0], classes.avatar34)}
            {this.natAv(this.props.nations[1], classes.avatar34)}
          </div>
          <div className={classes.avatarRow34}>
            {this.natAv(this.props.nations[2], classes.avatar34)}
            {this.props.nations.length > 3
              ? this.natAv(this.props.nations[3], classes.avatar34)
              : ""}
          </div>
        </div>
      );
    } else {
      const row0 = [];
      const row1 = [];
      const row2 = [];
      if (this.props.nations.length === 5) {
        row0.push(this.props.nations[0]);
        row1.push(this.props.nations[1]);
        row1.push(this.props.nations[2]);
        row1.push(this.props.nations[3]);
        row2.push(this.props.nations[4]);
      } else {
        this.props.nations.forEach((nation) => {
          if (row0.length < 3) {
            row0.push(nation);
          } else if (row1.length < 3) {
            row1.push(nation);
          } else if (row2.length < 3) {
            row2.push(nation);
          }
        });
      }
      return (
        <div className={classes.groupContainer}>
          <div className={classes.avatarRow59}>
            {row0.map((nation) => {
              return this.natAv(nation, classes.avatar59);
            })}
          </div>
          <div className={classes.avatarRow59}>
            {row1.map((nation) => {
              return this.natAv(nation, classes.avatar59);
            })}
          </div>
          {row2.length > 0 ? (
            <div className={classes.avatarRow59}>
              {row2.map((nation) => {
                return this.natAv(nation, classes.avatar59);
              })}
            </div>
          ) : (
            ""
          )}
        </div>
      );
    }
  }
}

export default withStyles(styles, { withTheme: true })(NationAvatarGroup);
