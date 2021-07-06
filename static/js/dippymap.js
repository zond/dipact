export function dippyMap(container) {
	var that = this;
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
		$(el).find("#" + province + "Center")[0].style.stroke = color;
	};
	that.colorProvince = function(province, color) {
		var path = $(el).find("#" + that.selEscape(province))[0];
		path.removeAttribute("style");
		path.setAttribute("fill", color);
		path.setAttribute("fill-opacity", "0.8");
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
		var x = 0;
		var y = 0;
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
		}
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
	};
	that.addBox = function(province, corners, color, opts = {}) {
		var loc = that.centerOf(province);
		loc.x -= 3;
		loc.y -= 3;
		var all = Math.PI * 2;
		var step = all / corners;
		var startAngle = Math.PI * 1.5;
		if (corners % 2 == 0) {
			startAngle += step / 2;
		}
		var angle = startAngle;
		var path = document.createElementNS(SVG, "path");
		path.setAttribute(
			"style",
			"fill-rule:evenodd;fill:" +
				color +
				";stroke:" +
				(opts.stroke || "#000000") +
				";stroke-width:0.5;stroke-miterlimit:4;stroke-opacity:1.0;fill-opacity:0.9;"
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
		subBox(27);
		subBox(20);
		path.setAttribute("d", d);
		$(el)
			.find("#orders")[0]
			.appendChild(path);
	};
	that.addArrow = function(provs, color, opts = {}) {
		var start = null;
		var middle = null;
		var end = null;
		if (provs.length == 3 && provs[1] == provs[2]) {
			provs.pop();
		}
		if (provs.length == 2) {
			start = that.centerOf(provs[0]);
			end = that.centerOf(provs[1]);
			middle = start.add(end.sub(start).div(2.0));
		} else {
			start = that.centerOf(provs[0]);
			middle = that.centerOf(provs[1]);
			end = that.centerOf(provs[2]);
		}
		var boundF = 3;
		var headF1 = boundF * 3;
		var headF2 = boundF * 6;
		var spacer = boundF * 2;
		var boundFDiag = Math.sqrt(Math.pow(boundF, 2) + Math.pow(boundF, 2));
		var part1 = new that.Vec(start, middle);
		var part2 = new that.Vec(middle, end);
		var all = new that.Vec(start, end);
		var start0 = start
			.add(part1.dir().mul(spacer))
			.add(part1.orth().mul(boundF));
		var start1 = start
			.add(part1.dir().mul(spacer))
			.sub(part1.orth().mul(boundF));
		var sumOrth = part1.orth().add(part2.orth());
		var avgOrth = sumOrth.div(sumOrth.len());
		var control0 = middle.add(avgOrth.mul(boundF));
		var control1 = middle.sub(avgOrth.mul(boundF));
		var end0 = end
			.sub(part2.dir().mul(spacer + headF2))
			.add(part2.orth().mul(boundF));
		var end1 = end
			.sub(part2.dir().mul(spacer + headF2))
			.sub(part2.orth().mul(boundF));
		var end3 = end.sub(part2.dir().mul(spacer));
		var head0 = end0.add(part2.orth().mul(headF1));
		var head1 = end1.sub(part2.orth().mul(headF1));

		var path = document.createElementNS(SVG, "path");
		path.setAttribute(
			"style",
			"fill:" +
				color +
				";stroke:" +
				(opts.stroke || "#000000") +
				";stroke-width:0.5;stroke-miterlimit:4;stroke-opacity:1.0;fill-opacity:0.7;"
		);
		var d = "M " + start0.x + "," + start0.y;
		d +=
			" C " +
			control0.x +
			"," +
			control0.y +
			"," +
			control0.x +
			"," +
			control0.y +
			"," +
			end0.x +
			"," +
			end0.y;
		d += " L " + head0.x + "," + head0.y;
		d += " L " + end3.x + "," + end3.y;
		d += " L " + head1.x + "," + head1.y;
		d += " L " + end1.x + "," + end1.y;
		d +=
			" C " +
			control1.x +
			"," +
			control1.y +
			"," +
			control1.x +
			"," +
			control1.y +
			"," +
			start1.x +
			"," +
			start1.y;
		d += " z";
		path.setAttribute("d", d);
		$(el)
			.find("#orders")[0]
			.appendChild(path);
	};
	that.addCross = function(province, color, opts = {}) {
		var bound = 14;
		var width = 4;
		var loc = that.centerOf(province);
		loc.x -= 3;
		loc.y -= 3;
		var path = document.createElementNS(SVG, "path");
		path.setAttribute(
			"style",
			"fill:" +
				color +
				";stroke:" +
				(opts.stroke || "#000000") +
				";stroke-width:0.5;stroke-miterlimit:4;stroke-opacity:1.0;fill-opacity:0.9;"
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
	that.addOrder = function(order, color, opts = {}) {
		if (order[1] == "Hold") {
			addBox(order[0], 4, color, opts);
		} else if (order[1] == "Move") {
			addArrow([order[0], order[2]], color, opts);
		} else if (order[1] == "MoveViaConvoy") {
			addArrow([order[0], order[2]], color, opts);
			addBox(order[0], 5, color, opts);
		} else if (order[1] == "Build") {
			addUnit(
				"unit" + order[2],
				order[0],
				color,
				false,
				true,
				"#orders",
				opts
			);
		} else if (order[1] == "Disband") {
			addCross(order[0], color, opts);
			addBox(order[0], 4, color, opts);
		} else if (order[1] == "Convoy") {
			addBox(order[0], 5, color, opts);
			addArrow([order[2], order[0], order[3]], color, opts);
		} else if (order[1] == "Support") {
			if (order.length == 3) {
				addBox(order[0], 3, color, opts);
				addArrow([order[2], order[3]], color, opts);
			} else {
				addBox(order[0], 3, color);
				addArrow([order[0], order[2], order[3]], color, opts);
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
			color = "#000000";
		}
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
		$(el)
			.find(layer)[0]
			.appendChild(shadow[0]);
		$(el)
			.find(layer)[0]
			.appendChild(unit[0]);
	};
	return that;
}
