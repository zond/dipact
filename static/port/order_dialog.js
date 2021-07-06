import * as helpers from '%{ cb "/js/helpers.js" }%';

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
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", { "page_title": "OrderDialog", "page_location": location.href });
			gtag("event", "page_view");
		}
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
		helpers.unback(this.close);
		this.setState({ open: false }, _ => {
			if (this.state.onClose) {
				this.state.onClose();
			}
		});
	}
	render() {
		return (
			<MaterialUI.Dialog
				onEntered={helpers.genOnback(this.close)}
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
