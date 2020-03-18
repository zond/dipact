import * as helpers from '%{ cb "./helpers.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == this.props.user.Email;
		});
		this.renderPhase = this.renderPhase.bind(this);
		this.map = null;
		this.variant = null;
		this.phases = [];
	}
	// This function is wonky, because for historical
	// reasons the diplicity server provides phases in
	// different formats for 'start phase for variant'
	// and 'a phase of an actual game'.
	renderPhase(phase) {
		let orderPromise = null;
		let orderLink = phase.Links.find(l => {
			return l.Rel == "orders";
		});
		if (orderLink) {
			orderPromise = fetch(
				helpers.createRequest(orderLink.URL)
			).then(resp => resp.json());
		}
		if (phase.Properties.Units instanceof Array) {
			phase.Properties.Units.forEach(unitData => {
				this.map.addUnit(
					"unit" + unitData.Unit.Type,
					unitData.Province,
					this.natCol(unitData.Unit.Nation)
				);
			});
		} else {
			for (let prov in phase.Properties.Units) {
				let unit = phase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					this.natCol(unit.Nation)
				);
			}
		}
		if (phase.Properties.Dislodgeds instanceof Array) {
			phase.Properties.Dislodgeds.forEach(disData => {
				this.map.addUnit(
					"unit" + disData.Unit.Type,
					disData.Province,
					this.natCol(disData.Unit.Nation)
				);
			});
		} else {
			for (let prov in phase.Properties.Dislodgeds) {
				let unit = phase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					this.natCol(unit.Nation),
					true
				);
			}
		}
		let SCs = {};
		if (phase.Properties.SupplyCenters) {
			SCs = phase.Properties.SupplyCenters;
		} else {
			phase.Properties.SCs.forEach(scData => {
				SCs[scData.Province] = scData.Owner;
			});
		}
		for (let prov in this.variant.Properties.Graph.Nodes) {
			let node = this.variant.Properties.Graph.Nodes[prov];
			if (node.SC && SCs[prov]) {
				this.map.colorProvince(prov, this.natCol(SCs[prov]));
			} else {
				this.map.hideProvince(prov);
			}
		}
		this.map.showProvinces();
		if (phase.Properties.Orders) {
			for (let nat in phase.Properties.Orders) {
				let orders = phase.Properties.Orders[nat];
				for (let prov in orders) {
					let order = orders[prov];
					this.map.addOrder([prov] + order, this.natCol(nat));
				}
			}
		}
		if (orderPromise) {
			orderPromise.then(js => {
				js.Properties.forEach(orderData => {
					this.map.addOrder(
						orderData.Properties.Parts,
						this.natCol(orderData.Properties.Nation)
					);
				});
			});
		}
		for (let prov in phase.Properties.Resolutions) {
			let res = phase.Properties.Resolutions[prov];
			if (res != "OK") {
				this.map.addCross(prov, "#ff0000");
			}
		}
	}
	natCol(nat) {
		return this.map.contrasts[this.variant.Properties.Nations.indexOf(nat)];
	}
	componentDidMount() {
		let promises = [
			fetch(
				helpers.createRequest(
					"/Variant/" +
						this.props.game.Properties.Variant +
						"/Map.svg"
				)
			).then(resp => resp.text()),
			fetch(
				helpers.createRequest(
					"/Variant/" + this.props.game.Properties.Variant
				)
			)
				.then(resp => resp.json())
				.then(js => {
					let promises = [Promise.resolve(js)];
					js.Properties.UnitTypes.forEach(unitType => {
						promises.push(
							fetch(
								helpers.createRequest(
									"/Variant/" +
										this.props.game.Properties.Variant +
										"/Units/" +
										unitType +
										".svg"
								)
							)
								.then(resp => resp.text())
								.then(svg => {
									return {
										name: unitType,
										svg: svg
									};
								})
						);
					});
					return Promise.all(promises);
				})
		];
		if (this.props.game.Properties.Started) {
			promises.push(
				fetch(
					helpers.createRequest(
						this.props.game.Links.find(l => {
							return l.Rel == "phases";
						}).URL
					)
				).then(resp => resp.json())
			);
		}
		Promise.all(promises).then(values => {
			let mapSVG = values[0];
			document.getElementById("map").innerHTML = mapSVG;
			this.map = dippyMap($("#map"));

			let variantData = values[1];
			this.variant = variantData[0];
			variantData.slice(1).forEach(unitData => {
				let container = document.createElement("div");
				container.setAttribute("id", "unit" + unitData.name);
				container.innerHTML = unitData.svg;
				document.getElementById("units").appendChild(container);
			});
			if (this.props.game.Properties.Started) {
				this.phases = values[2].Properties;
				this.renderPhase(this.phases[this.phases.length - 1]);
			} else {
				fetch(
					helpers.createRequest(
						"/Variant/" +
							this.props.game.Properties.Variant +
							"/Start"
					)
				)
					.then(resp => resp.json())
					.then(this.renderPhase);
			}
		});
	}
	render() {
		return [
			<MaterialUI.AppBar key="top-nav" position="static">
				<MaterialUI.Toolbar
					style={{ display: "flex", justifyContent: "space-between" }}
				>
					<MaterialUI.IconButton onClick={this.props.close}>
						{helpers.createIcon("\ue5cd")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue0b7")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue8b8")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue86c")}
					</MaterialUI.IconButton>
				</MaterialUI.Toolbar>
			</MaterialUI.AppBar>,
			<div key="map-div" style={{ display: "flex" }} id="map"></div>,
			<div key="units-div" style={{ display: "none" }} id="units"></div>
		];
	}
}
