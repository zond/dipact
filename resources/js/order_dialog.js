export default class OrderDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			options: [],
			onClick: null,
			onClose: null
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onClick = this.onClick.bind(this);
		this.close = this.close.bind(this);
	}
	onClick(ev) {
		const option = ev.currentTarget.getAttribute("xoption");
		this.setState({ open: false }, _ => {
			if (this.state.onClick) {
				this.state.onClick(option);
			}
		});
	}
	close() {
		this.setState({ open: false }, _ => {
			if (this.state.onClose) {
				this.state.onClose();
			}
		});
	}
	render() {
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<MaterialUI.ButtonGroup orientation="vertical">
					{this.state.options.map(option => {
						return (
							<MaterialUI.Button
								key={option}
								xoption={option}
								onClick={this.onClick}
							>
								{option}
							</MaterialUI.Button>
						);
					})}
				</MaterialUI.ButtonGroup>
			</MaterialUI.Dialog>
		);
	}
}
