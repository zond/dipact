export default class GameListElement extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MaterialUI.ExpansionPanel>
        <MaterialUI.ExpansionPanelSummary
          className="game-summary"
          expandIcon={<i className="material-icons">&#xE5Cf;</i>}
        >
          <MaterialUI.Typography textroverflow="ellipsis" noWrap={true}>
            {this.props.game.Name}
          </MaterialUI.Typography>
        </MaterialUI.ExpansionPanelSummary>
        <MaterialUI.ExpansionPanelDetails>
          <MaterialUI.Typography>
            {JSON.stringify(this.props.game)}
          </MaterialUI.Typography>
        </MaterialUI.ExpansionPanelDetails>
      </MaterialUI.ExpansionPanel>
    );
  }
}
