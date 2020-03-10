import GameListElement from '%{ cb "./game_list_element.js" }%';

export default class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    fetch(this.props.url.toString(), {
      headers: { Accept: "application/json" }
    })
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
            return <GameListElement key={idx} game={game} variants={this.props.variants} />;
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
