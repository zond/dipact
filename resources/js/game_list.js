import * as helpers from '%{ cb "./helpers.js" }%';

import GameListElement from '%{ cb "./game_list_element.js" }%';

export default class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    fetch(helpers.createRequest(this.props.url.toString()))
      .then(resp => resp.json())
      .then(js => {
        this.setState({ games: js.Properties });
      });
  }
  render() {
    if (this.state.games) {
      return (
        <div>
          {this.state.games.map((game, idx) => {
            return (
              <GameListElement
                key={idx}
                game={game}
                variants={this.props.variants}
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <MaterialUI.Container style={{ textAlign: "center" }} maxWidth="sm">
          <MaterialUI.CircularProgress />
        </MaterialUI.Container>
      );
    }
  }
}
