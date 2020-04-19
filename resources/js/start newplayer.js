import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameList from '%{ cb "/js/game_list.js" }%';
import CreateGameDialog from '%{ cb "/js/create_game_dialog.js" }%';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newGameFormOpen: false };
    this.stagingGamesList = null;
  }
  render() {
    return (


{/* TODO: Martin, from here you can insert if new player */}

      <React.Fragment>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100% - 54px)",
            overflowY: "scroll",
            backgroundColor: "#FDE2B5",
          }}
        >
          <div
            id="top"
            style={{
              width: "100%",
              maxWidth: "400px",
              alignSelf: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              className={helpers.scopedClass(`
                  width: calc(100% - 48px);
                  max-width: 340px;
                  margin: 24px;
                  
                  `)}
              src="../static/img/logo_dark.svg"
            />

            <MaterialUI.Typography
              variant="body2"
              style={{
                margin: "0px 16px 0px 16px",
              }}
            >
              Welcome! Because Diplomacy games are all about human interaction,
              they can take multiple days. Before joining your first game, we
              strongly advice you to read the rules firstly.
            </MaterialUI.Typography>
            <MaterialUI.Button
              style={{ margin: "16px auto", minWidth: "200px" }}
              color="primary"
              variant="outlined"
              key="find-open"
              href="https://en.wikibooks.org/wiki/Diplomacy/Rules"
              target="_blank"
            >
              Read the rules
            </MaterialUI.Button>
          </div>
          <div id="bottom">
            <div
              style={{
                backgroundImage: "url('../static/img/soldiers.svg'",
                height: "72px",
              }}
            ></div>
            <div
              style={{
                backgroundColor: "#291B1B",
                display: "flex",
                flexDirection: "column",
                paddingBottom: "24px",
              }}
            >
              <MaterialUI.Button
                style={{ margin: "4px auto", minWidth: "200px" }}
                variant="outlined"
                color="secondary"
                key="find-open"
                onClick={this.props.findOpenGame}
              >
                Find open game
              </MaterialUI.Button>
              <MaterialUI.Button
                style={{ margin: "4px auto", minWidth: "200px" }}
                variant="outlined"
                color="secondary"
                key="find-private"
                onClick={this.props.findPrivateGame}
              >
                Find private game
              </MaterialUI.Button>
              <MaterialUI.Button
                style={{ margin: "4px auto", minWidth: "200px" }}
                variant="outlined"
                color="secondary"
                key="create"
                onClick={(_) => {
                  this.createGameDialog.setState({
                    open: true,
                  });
                }}
              >
                Create game
              </MaterialUI.Button>
            </div>
          </div>
        </div>
      </React.Fragment>

      {/* TODO: Martin, from here you can insert if new player */}
    );
  }
}
