class MainMenu extends React.Component {
	render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				{htmlFor: 'drawer-control', className: 'drawer-toggle'},
			),
			React.createElement(
				'input',
				{type: 'checkbox', id: 'drawer-control', className: 'drawer'},
			),
			React.createElement(
				'div',
				{className: 'container'},
				React.createElement('div', {className: 'row'}, React.createElement('button', {className: 'col-sm-12 left'}, 'My started games')),
				React.createElement('div', {className: 'row'}, React.createElement('button', {className: 'col-sm-12 left'}, 'My staging games')),
				React.createElement('div', {className: 'row'}, React.createElement('button', {className: 'col-sm-12 left'}, 'My finished games')),
				React.createElement('div', {className: 'row'}, React.createElement('button', {className: 'col-sm-12 left'}, 'Open games')),
				React.createElement('div', {className: 'row'}, React.createElement('button', {className: 'col-sm-12 left'}, 'Started games')),
				React.createElement('div', {className: 'row'}, React.createElement('button', {className: 'col-sm-12 left'}, 'Finished games')),
			)
		);
	}
}

