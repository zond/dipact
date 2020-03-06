class Login extends React.Component {
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
					React.createElement(
						'button',
						null,
						React.createElement(
							'a',
							{href: this.props.loginURL},
							'Login'
						)
					)
				),
				React.createElement(
					'div',
					{className: 'col-sm'})
			)
		);
	}
}

