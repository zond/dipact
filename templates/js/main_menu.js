class MainMenu extends React.Component {
	render() {
		return React.createElement(
			'div',
			{className: 'container'},
			React.createElement(
				'div',
				{className: 'row'},
				React.createElement(
					'div',
					{className: 'col-sm'}),
				React.createElement(
					'div',
					{className: 'col-sm'},
					'Welcome ' + this.props.state.user.GivenName
				),
				React.createElement(
					'div',
					{className: 'col-sm'})
			)
		);
	}
}

