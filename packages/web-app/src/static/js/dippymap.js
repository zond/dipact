import $ from "jquery";

export function dippyMap(container) {
	var that = {};
	var el = null;
	var SVG = "http://www.w3.org/2000/svg";
	if (container.find("svg").length > 0) {
		el = container.find("svg")[0];
	}
	that.addReadyAction = function(cb) {
		cb();
	};
	// Based on http://godsnotwheregodsnot.blogspot.se/2012/09/color-distribution-methodology.html.
	that.contrasts = [
		"#F44336",
		"#2196F3",
		"#80DEEA",
		"#90A4AE",
		"#4CAF50",
		"#FFC107",
		"#F5F5F5",
		"#009688",
		"#FFEB3B",
		"#795548",
		"#E91E63",
		"#CDDC39",
		"#FF9800",
		"#D05CE3",
		"#9A67EA",
		"#FF6090",
		"#6EC6FF",
		"#80E27E",
		"#A98274",
		"#CFCFCF",
		"#FF34FF",
		"#1CE6FF",
		"#FFDBE5",
		"#FF7961",
		"#C66900",
		"#9C27B0",
		"#3F51B5",
		"#C8B900",
		"#C2185B",
		"#BA000D",
		"#607D8B",
		"#087F23",
		"#673AB7",
		"#0069C0",
		"#34515E",
		"#002984",
		"#004C40",
		"#FFFF6E",
		"#B4FFFF",
		"#6A0080",
		"#757DE8",
		"#04F757",
		"#CEFDAE",
		"#974D2B",
		"#974D2B",
		"#FF2F80",
		"#0CBD66",
		"#FF90C9",
		"#BEC459",
		"#0086ED",
		"#FFB500",
		"#0AA6D8",
		"#A05837",
		"#EEC3FF",
		"#456648",
		"#D790FF",
		"#6A3A4C",
		"#324E72",
		"#A4E804",
		"#CB7E98",
		"#0089A3",
		"#404E55",
		"#FDE8DC",
		"#5B4534",
		"#922329",
		"#3A2465",
		"#99ADC0",
		"#BC23FF",
		"#72418F",
		"#201625",
		"#FFF69F",
		"#549E79",
		"#9B9700",
		"#772600",
		"#6B002C",
		"#6367A9",
		"#A77500",
		"#7900D7",
		"#1E6E00",
		"#C8A1A1",
		"#885578",
		"#788D66",
		"#7A87A1",
		"#B77B68",
		"#456D75",
		"#6F0062",
		"#00489C",
		"#001E09",
		"#C2FF99",
		"#C0B9B2",
		"#CC0744",
		"#A079BF",
		"#C2FFED",
		"#372101",
		"#00846F",
		"#013349",
		"#300018",
		"#A1C299",
		"#7B4F4B",
		"#000035",
		"#DDEFFF",
		"#D16100",
		"#B903AA"
	];
	that.contrastNeutral = "#f4d7b5";
	that.Poi = function(x, y) {
		this.x = x;
		this.y = y;
		this.add = function(p) {
			return new that.Poi(x + p.x, y + p.y);
		};
		this.sub = function(p) {
			return new that.Poi(x - p.x, y - p.y);
		};
		this.len = function() {
			return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		};
		this.div = function(f) {
			return new that.Poi(x / f, y / f);
		};
		this.mul = function(f) {
			return new that.Poi(x * f, y * f);
		};
		this.orth = function() {
			return new that.Poi(-y, x);
		};
	};
	that.Vec = function(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
		this.len = function() {
			return p2.sub(p1).len();
		};
		this.dir = function() {
			return p2.sub(p1).div(this.len());
		};
		this.orth = function() {
			return this.dir().orth();
		};
	};
	that.selEscape = function(sel) {
		return sel.replace("/", "\\/");
	};
	that.centerOf = function(province) {
		var center = $(el)
			.find("#" + that.selEscape(province) + "Center")
			.first();
		var match = /^m\s+([\d-.]+),([\d-.]+)\s+/.exec(center.attr("d"));
		var x = Number(match[1]);
		var y = Number(match[2]);
		var parentTransform = center.parent().attr("transform");
		if (parentTransform != null) {
			var transMatch = /^translate\(([\d.eE-]+),\s*([\d.eE-]+)\)$/.exec(
				parentTransform
			);
			x += Number(transMatch[1]) - 1.5;
			y += Number(transMatch[2]) - 2;
		}
		return new that.Poi(x, y);
	};
	that.showProvinces = function() {
		$(el)
			.find("#provinces")[0]
			.removeAttribute("style");
	};
	that.copySVG = function(sourceId) {
		var source = $("#" + sourceId + " svg")
			.first()
			.clone();
		container[0].innerHTML = "";
		container[0].appendChild(source[0]);
		el = container.find("svg")[0];
	};
	that.colorSC = function(province, color) {
//TODO: Replace or add the proSC version for newer maps.
		$(el).find("#" + province + "Center")[0].style.stroke = color;
	};
	that.colorProvince = function(province, color) {
		var path = $(el).find("#" + that.selEscape(province))[0];
		path.removeAttribute("style");
		path.setAttribute("fill", color);
		path.setAttribute("fill-opacity", "0.4");
	};
	that.hideProvince = function(province) {
		var path = $(el).find("#" + that.selEscape(province))[0];
		path.removeAttribute("style");
		path.setAttribute("fill", "#ffffff");
		path.setAttribute("fill-opacity", "0");
	};
	that.highlightProvince = function(province) {
		var prov = $(el)
			.find("#" + that.selEscape(province))
			.first();
		var copy = prov.clone()[0];
		copy.setAttribute("id", prov.attr("id") + "_highlight");
		copy.setAttribute("style", "fill:url(#stripes)");
		copy.setAttribute("fill-opacity", "1");
		copy.removeAttribute("transform");
		var curr = prov[0];
		while (curr != null && curr.getAttribute != null) {
			var trans = curr.getAttribute("transform");
			if (trans != null) {
				copy.setAttribute("transform", trans);
			}
			curr = curr.parentNode;
		}
		copy.setAttribute("stroke", "none");
		$(el)
			.find("#highlights")[0]
			.appendChild(copy);
	};
	that.unhighlightProvince = function(province) {
		$(el)
			.find("#" + that.selEscape(province) + "_highlight")
			.remove();
	};
	var clickListenerRemovers = [];
	that.clearClickListeners = function() {
		for (var i = 0; i < clickListenerRemovers.length; i++) {
			clickListenerRemovers[i]();
		}
	};
	that.addClickListener = function(province, handler, options) {
		var nohighlight = (options || {}).nohighlight;
		var permanent = (options || {}).permanent;
		if (!nohighlight) {
			that.highlightProvince(province);
		}
		var prov = $(el)
			.find("#" + that.selEscape(province))
			.first();
		var copy = prov.clone()[0];
		copy.setAttribute("id", prov.attr("id") + "_click");
		copy.setAttribute("style", "fill:#000000;fill-opacity:0;stroke:none;");
		copy.setAttribute("stroke", "none");
		copy.removeAttribute("transform");
		var x = 0;
		var y = 0;
		var curr = prov[0];
		while (curr != null && curr.getAttribute != null) {
			var trans = curr.getAttribute("transform");
			if (trans != null) {
				var transMatch = /^translate\(([\d.eE-]+),\s*([\d.eE-]+)\)$/.exec(
					trans
				);
				x += Number(transMatch[1]);
				y += Number(transMatch[2]);
			}
			curr = curr.parentNode;
		}
		copy.setAttribute("transform", "translate(" + x + "," + y + ")");
		el.appendChild(copy);
		function clickHandler(e) {
			handler(province);
		}
		$(copy).bind("click", clickHandler);
		if ((options || {}).touch) {
			function touchstartHandler(e) {
				e.preventDefault();
				var touchendHandler = null;
				var touchmoveHandler = null;
				var moved = false;
				var at = new Date().getTime();
				function unregisterTouchHandlers() {
					$(copy).unbind("touchend", touchendHandler);
					$(copy).unbind("touchmove", touchmoveHandler);
				}
				touchendHandler = function(e) {
					if (!moved || new Date().getTime() - at < 300) {
						handler(province);
					}
					unregisterTouchHandlers();
				};
				$(copy).bind("touchend", touchendHandler);
				touchmoveHandler = function(e) {
					moved = true;
				};
				$(copy).bind("touchmove", touchmoveHandler);
			}
			$(copy).bind("touchstart", touchstartHandler);
			if (!permanent) {
				clickListenerRemovers.push(function() {
					if (!nohighlight) {
						that.unhighlightProvince(province);
					}
					if ((options || {}).touch) {
						$(copy).unbind("touchstart", touchstartHandler);
					}
					$(copy).unbind("click", clickHandler);
				});
			}
		}
	};
	that.addBox = function(province, corners, color, opts = {}) {
		var loc = that.centerOf(province);
		loc.x -= 3;
		//loc.y -= 3;
		var all = Math.PI * 2;
		var step = all / corners;
		var startAngle = Math.PI * 1.5;
		if (corners % 2 === 0) {
			startAngle += step / 2;
		}
		var angle = startAngle;
		var path = document.createElementNS(SVG, "path");
		path.setAttribute(
			"style",
			"fill:none;stroke:#000000;stroke-width:5;stroke-miterlimit:4;stroke-opacity:0.4;"
		);
		var d = "";
		var subBox = function(boundF) {
			d +=
				"M " +
				(loc.x + Math.cos(angle) * boundF) +
				"," +
				(loc.y + Math.sin(angle) * boundF);
			for (var i = 1; i < corners; i++) {
				angle += step;
				d +=
					" L " +
					(loc.x + Math.cos(angle) * boundF) +
					"," +
					(loc.y + Math.sin(angle) * boundF);
			}
			d += " z";
		};
		subBox(18);
		path.setAttribute("d", d);
		$(el)
			.find("#orders")[0]
			.appendChild(path);
	};
//TODO: add the arrow. 

	that.invokeMarker = function(color, large) {
		if (large) { 
			var size = "Large";
		} else {
			var size = "Small";
		}

		//Check if a marker exists with that colour and size
		console.log("Invoking marker: " + color.substring(1) + size + "Marker");
		let element = document.getElementById(color.substring(1) + size + "Marker");

		if (!element) {
			const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
			marker.setAttributeNS(null, "id", color.substring(1) + size + "Marker");
			marker.setAttributeNS(null, "viewBox", "0 0 15 10");
			marker.setAttributeNS(null, "refX", "4");
			marker.setAttributeNS(null, "refY", "5");
			if (!large) { 
			marker.setAttributeNS(null, "markerWidth", "4");
			marker.setAttributeNS(null, "markerHeight", "4");
			} else {	
			marker.setAttributeNS(null, "markerWidth", "3");
			marker.setAttributeNS(null, "markerHeight", "3");
			}
			marker.setAttributeNS(null, "orient", "auto-start-reverse");
			document.getElementById("defs14").appendChild(marker); //TODO: this needs to be standardized for all defs

			console.log("adding Marker " + color.substring(1) + size + "Marker");

			const markerContent = document.createElementNS("http://www.w3.org/2000/svg", "path");
			markerContent.setAttributeNS(null, "d", "M 0 0 L 10 5 L 0 10 L 2 5 z");
			markerContent.setAttributeNS(null, "fill", color);
			markerContent.setAttributeNS(null, "stroke", "none");
			document.getElementById(color.substring(1) + size + "Marker").appendChild(markerContent);
		}


	}

	that.addArrow = function(provs, color, border, opts = {}) {
		var start = null;
		var middle = null;
		var end = null;
		if (provs.length === 3 && provs[1] === provs[2]) {
			provs.pop();
		}
		if (provs.length === 2) {
			start = that.centerOf(provs[0]);
			end = that.centerOf(provs[1]);
			middle = start.add(end.sub(start).div(2.0));
		} else {
			start = that.centerOf(provs[0]);
			middle = that.centerOf(provs[1]);
			end = that.centerOf(provs[2]);
		}

//Define the arrow definitions

		var spacer = 12;
		var startVec = new that.Vec(start, middle);
		var endVec = new that.Vec(middle, end);

		var arrowStart = start
			.add(startVec.dir().mul(spacer));

		var arrowEnd = end
			.sub(endVec.dir().mul(spacer*1.5)); //WILL NEED EXTRA SPACE FOR ENDPOINT

//Select whether the arrow is solid (move) or dashed (support)
		if (provs.length === 3) {
			var supportBorderStrokeDashArray = "3 2";
		} else {
			var supportBorderStrokeDashArray = "0 0";
		}


//TODO Joren: Check if a marker exists with the right background colour.


//	Create the background arrow
		that.invokeMarker(border, true);
		var path = document.createElementNS(SVG, "path");
		path.setAttribute(
			"style",
			"fill: none;stroke:" + border + ";stroke-width:8;stroke-dasharray:" + supportBorderStrokeDashArray + "; marker-end: url(#" + border.substring(1) + "LargeMarker)"
		);
		console.log("Using marker: " + color.substring(1) + "LargeMarker");

		var d = "M" + arrowStart.x + " " + arrowStart.y + " Q " + middle.x + " " + middle.y + " " + arrowEnd.x + " " + arrowEnd.y;
		path.setAttribute("d", d);
		$(el)
			.find("#orders")[0]
			.appendChild(path);


//Create the coloured foreground
		that.invokeMarker(color, false);
		var colorPath = document.createElementNS(SVG, "path");
		colorPath.setAttribute(
			"style",
			"fill: none;stroke:" + color + ";stroke-width:3;stroke-dasharray:" + supportBorderStrokeDashArray + ";" + "; marker-end: url(#" + color.substring(1) + "SmallMarker)"
		);
		console.log("Using marker: " + color.substring(1) + "SmallMarker");

		var d = "M" + arrowStart.x + " " + arrowStart.y + " Q " + middle.x + " " + middle.y + " " + arrowEnd.x + " " + arrowEnd.y;
		colorPath.setAttribute("d", d);
		$(el)
			.find("#orders")[0]
			.appendChild(colorPath);
	};
	that.addPlus = function(province, color, opts = {}) {
		var loc = that.centerOf(province);
		var size = 16;
		var lineWidth = (size / 10);
		loc.x -= 10;
		loc.y -= 10;
		var path = document.createElementNS(SVG, "path");
		path.setAttribute(
			"style",
			"fill:" +
				color +
				";stroke:" +
				"#000000" +
				";stroke-width:1;stroke-miterlimit:4;stroke-opacity:1.0;fill-opacity:1;"
		);
		var d =	"M " + (loc.x + size) + "," + (loc.y + (size/2+lineWidth)) + 
		" H " + (loc.x + (size/2+lineWidth)) +
		" V " + (loc.y + size) +
		" H " + (loc.x + (size/2-lineWidth)) +
		" V " + (loc.y + (size/2+lineWidth)) +
		" H " + (loc.x) +
		" V " + (loc.y + (size/2-lineWidth)) +
		" H " + (loc.x + (size/2-lineWidth)) +
		" V " + (loc.y) +
		" H " + (loc.x + (size/2+lineWidth)) +
		" V " + (loc.y + (size/2-lineWidth)) +
		" H " + (loc.x + size) +
		" Z ";
		path.setAttribute("d", d);
		$(el)
			.find("#orders")[0]
			.appendChild(path);
	};
	that.addCross = function(provs, color, opts = {}) {
		var loc = null;
//		console.log("adding cross");
//		console.log(provs);

		if (!Array.isArray(provs)) {
			loc = that.centerOf(provs);
		} else if (provs.length === 3 && provs[1] === provs[2]) {
			provs.pop();
		} 

		if (Array.isArray(provs) && provs.length === 2) {
			var start = that.centerOf(provs[0]);
			var end = that.centerOf(provs[1]);
			loc = start.add(end.sub(start).div(2.0));
		} else if (Array.isArray(provs) && provs.length === 3) {
//Create the point for the arrow if a curve
			var start = that.centerOf(provs[0]);
			var middle = that.centerOf(provs[1]);
			var end = that.centerOf(provs[2]);

			loc = start;
  			loc.x = (4/9) * start.x + (4/9) * middle.x + (1/9) * end.x;
  			loc.y = (4/9) * start.y + (4/9) * middle.y + (1/9) * end.y;
		} 


		var bound = 6;
		var width = 2;
		loc.x -= 0;
		loc.y -= 0;

		var path = document.createElementNS(SVG, "path");
		path.setAttribute(
			"style",
			"fill:" +
				"#FB6C6C" +
				";stroke:" +
				"#000000" +
				";stroke-width:1.5;stroke-miterlimit:4;stroke-opacity:1.0;fill-opacity:1;"
		);
		var d =
			"M " +
			loc.x +
			"," +
			(loc.y + width) +
			" " +
			"L " +
			(loc.x + bound) +
			"," +
			(loc.y + bound + width) +
			" " +
			"L " +
			(loc.x + bound + width) +
			"," +
			(loc.y + bound) +
			" " +
			"L " +
			(loc.x + width) +
			"," +
			loc.y +
			" " +
			"L " +
			(loc.x + bound + width) +
			"," +
			(loc.y - bound) +
			" " +
			"L " +
			(loc.x + bound) +
			"," +
			(loc.y - bound - width) +
			" " +
			"L " +
			loc.x +
			"," +
			(loc.y - width) +
			" " +
			"L " +
			(loc.x - bound) +
			"," +
			(loc.y - bound - width) +
			" " +
			"L " +
			(loc.x - bound - width) +
			"," +
			(loc.y - bound) +
			" " +
			"L " +
			(loc.x - width) +
			"," +
			loc.y +
			" " +
			"L " +
			(loc.x - bound - width) +
			"," +
			(loc.y + bound) +
			" " +
			"L " +
			(loc.x - bound) +
			"," +
			(loc.y + bound + width) +
			" z";
		path.setAttribute("d", d);
		$(el)
			.find("#orders")[0]
			.appendChild(path);
	};
	that.removeOrders = function() {
		$(el)
			.find("#orders")
			.empty();
	};
	that.addOrder = function(order, color, opts = {}, success) {
//define the border based on order success
		if (success) {
			var border = "black";
		} else {
			var border = "#FB6C6C";
		}

//Create the order
		if (order[1] === "Hold") {
			that.addBox(order[0], 8, color, opts);
		} else if (order[1] === "Move") {
			that.addArrow([order[0], order[2]], color, border, opts);
		} else if (order[1] === "MoveViaConvoy") {
			that.addArrow([order[0], order[2]], color, border, opts);
			that.addBox(order[0], 5, color, opts);
		} else if (order[1] === "Build") {
			that.addUnit(
				"unit" + order[2],
				order[0],
				color,
				false,
				true,
				"#orders",
				opts
			);
			that.addPlus(
				order[0],
				color,
				opts
				)
		} else if (order[1] === "Disband") {
			that.addCross(order[0], color, opts);
			that.addBox(order[0], 4, color, opts);
		} else if (order[1] === "Convoy") {
			that.addBox(order[0], 5, color, opts);
			that.addArrow([order[2], order[0], order[3]], color, border, opts);
		} else if (order[1] === "Support") {
			if (order.length === 3) {
				that.addBox(order[0], 4, color, opts);
				that.addArrow([order[2], order[3]], color, border, opts);
			} else {
				that.addBox(order[0], 4, color);
				that.addArrow([order[0], order[2], order[3]], color, border, opts);
			}
		}
		//Add the cross in the right locationz 
		if (!success) {
			var border = "#FB6C6C";
			if (order[1] === "Move") {
			that.addCross([order[0], order[2]], "#FB6C6C")
			} else if (order[1] === "Support") {
			that.addCross([order[0], order[2], order[3]], "#FB6C6C")
			}
		}
	};
	
	that.removeUnits = function(layer) {
		if (typeof layer === "undefined") {
			layer = "#units";
		}
		$(el)
			.find(layer)
			.empty();
	};
	that.addUnit = function(
		sourceId,
		province,
		color,
		dislodged,
		build,
		layer,
		opts = {}
	) {
		if (typeof layer === "undefined") {
			layer = "#units";
		}
		var shadow = $("#" + sourceId)
			.find("#shadow")
			.first()
			.clone();
		var hullQuery = $("#" + sourceId + " svg").find("#hull");
		var bodyQuery = $("#" + sourceId + " svg").find("#body");
		var loc = that.centerOf(province);
		var unit = null;
		var opacity = 1;
		if (dislodged) {
			loc.x += 5;
			loc.y += 5;
			opacity = 0.73;
		}
		loc.y -= 11;
		if (hullQuery.length > 0) {
			unit = hullQuery.first().clone();
			loc.x -= 65;
			loc.y -= 15;
		} else {
			unit = bodyQuery.first().clone();
			loc.x -= 40;
			loc.y -= 5;
		}
		shadow.attr("transform", "translate(" + loc.x + ", " + loc.y + ")");
		unit.attr("transform", "translate(" + loc.x + ", " + loc.y + ")");
		if (build) {
			unit.attr(
			"style",
			"fill:" +
				"#000000" +
				";fill-opacity:" +
				opacity +
				";stroke:" +
				color +
				";stroke-width:1;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"
			);
		} else {
			unit.attr(
			"style",
			"fill:" +
				color +
				";fill-opacity:" +
				opacity +
				";stroke:" +
				(opts.stroke || "#000000") +
				";stroke-width:1;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"
			);
		}
		$(el)
			.find(layer)[0]
			.appendChild(shadow[0]);
		$(el)
			.find(layer)[0]
			.appendChild(unit[0]);
	};
	return that;
}
