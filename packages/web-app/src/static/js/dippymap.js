import $ from "jquery";

export function dippyMap(container) {
  var that = {};
  var el = null;
  var SVG = "http://www.w3.org/2000/svg";
  if (container.find("svg").length > 0) {
    el = container.find("svg")[0];
  }
  that.addReadyAction = function (cb) {
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
    "#B903AA",
  ];
  that.contrastNeutral = "#f4d7b5";
  that.Poi = function (x, y) {
    this.x = x;
    this.y = y;
    this.add = function (p) {
      return new that.Poi(x + p.x, y + p.y);
    };
    this.sub = function (p) {
      return new that.Poi(x - p.x, y - p.y);
    };
    this.len = function () {
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };
    this.div = function (f) {
      return new that.Poi(x / f, y / f);
    };
    this.mul = function (f) {
      return new that.Poi(x * f, y * f);
    };
    this.orth = function () {
      return new that.Poi(-y, x);
    };
  };
  that.Vec = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.len = function () {
      return p2.sub(p1).len();
    };
    this.dir = function () {
      return p2.sub(p1).div(this.len());
    };
    this.orth = function () {
      return this.dir().orth();
    };
  };
  that.selEscape = function (sel) {
    return sel.replace("/", "\\/");
  };
  that.centerOf = function (province) {
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
  that.showProvinces = function () {
    $(el).find("#provinces")[0].removeAttribute("style");
  };
  that.copySVG = function (sourceId) {
    var source = $("#" + sourceId + " svg")
      .first()
      .clone();
    container[0].innerHTML = "";
    container[0].appendChild(source[0]);
    el = container.find("svg")[0];
  };
  that.colorSC = function (province, color) {
    //TODO: Replace or add the proSC version for newer maps.
    $(el).find("#" + province + "Center")[0].style.stroke = color;
  };
  that.colorProvince = function (province, color) {
    var path = $(el).find("#" + that.selEscape(province))[0];
    path.removeAttribute("style");
    path.setAttribute("fill", color);
    path.setAttribute("fill-opacity", "0.4");
  };
  that.hideProvince = function (province) {
    var path = $(el).find("#" + that.selEscape(province))[0];
    path.removeAttribute("style");
    path.setAttribute("fill", "#ffffff");
    path.setAttribute("fill-opacity", "0");
  };
  that.highlightProvince = function (province) {
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
    $(el).find("#highlights")[0].appendChild(copy);
  };
  that.unhighlightProvince = function (province) {
    $(el)
      .find("#" + that.selEscape(province) + "_highlight")
      .remove();
  };
  var clickListenerRemovers = [];
  that.clearClickListeners = function () {
    for (var i = 0; i < clickListenerRemovers.length; i++) {
      clickListenerRemovers[i]();
    }
  };
  that.addClickListener = function (province, handler, options) {
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
        touchendHandler = function (e) {
          if (!moved || new Date().getTime() - at < 300) {
            handler(province);
          }
          unregisterTouchHandlers();
        };
        $(copy).bind("touchend", touchendHandler);
        touchmoveHandler = function (e) {
          moved = true;
        };
        $(copy).bind("touchmove", touchmoveHandler);
      }
      $(copy).bind("touchstart", touchstartHandler);
      if (!permanent) {
        clickListenerRemovers.push(function () {
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
  that.addBox = function (province, corners, color, opts = {}) {
    var loc = that.centerOf(province);
    loc.x -= 3;
    //loc.y -= 3;
    var all = Math.PI * 2;
    var step = all / corners;
    if (corners === 3) {
      var startAngle = Math.PI * 0.5;
    } else {
      var startAngle = Math.PI * 1.5;
    }
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
    var subBox = function (boundF) {
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
    $(el).find("#orders")[0].appendChild(path);
  };
  //TODO: add the arrow.

  that.invokeMarker = function (color, large, markerType) {
    var size = "Small";
    if (large) {
      size = "Large";
    }
    //Check if a marker exists with that colour and size
    let element = document.getElementById(
      color.substring(1) + size + markerType + "Marker"
    );
    if (!element) {
      const marker = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );
      marker.setAttributeNS(
        null,
        "id",
        color.substring(1) + size + markerType + "Marker"
      );
      marker.setAttributeNS(null, "viewBox", "0 0 15 10");

      marker.setAttributeNS(null, "refY", "5");
      if (!large) {
        if (markerType === "Support") {
          marker.setAttributeNS(null, "markerWidth", "4.5");
          marker.setAttributeNS(null, "markerHeight", "4.5");
          marker.setAttributeNS(null, "refX", "3.25");
        } else if (markerType === "Convoy") {
          marker.setAttributeNS(null, "markerWidth", "4");
          marker.setAttributeNS(null, "markerHeight", "4");
          marker.setAttributeNS(null, "refX", "7");
        } else {
          marker.setAttributeNS(null, "markerWidth", "4");
          marker.setAttributeNS(null, "markerHeight", "4");
          marker.setAttributeNS(null, "refX", "4");
        }
      } else if (markerType === "Convoy") {
          marker.setAttributeNS(null, "markerWidth", "3");
          marker.setAttributeNS(null, "markerHeight", "3");
          marker.setAttributeNS(null, "refX", "6");
        } else {
        marker.setAttributeNS(null, "markerWidth", "3");
        marker.setAttributeNS(null, "markerHeight", "3");
        marker.setAttributeNS(null, "refX", "4");
      }

      marker.setAttributeNS(null, "orient", "auto-start-reverse");
      document.getElementsByTagName("defs")[0].appendChild(marker); //TODO: this needs to be standardized for all defs

      var markerContent;
      markerContent = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      if (markerType === "Convoy") {
        markerContent = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
      }

      if (markerType === "Support") {
        markerContent.setAttributeNS(
          null,
          "d",
          "M 7.0754509,9.9980767 2.9341022,9.9999607 0.0044091,7.0729017 0.00254607,2.9315532 2.9296042,0.00186 7.070953,0 l 2.929693,2.9270583 0.0019,4.1413484 z"
        );
      } else if (markerType === "Convoy") {
        markerContent.setAttributeNS(null, "cx", "5");
        markerContent.setAttributeNS(null, "cy", "5");
        markerContent.setAttributeNS(null, "r", "4");
      } else {
        markerContent.setAttributeNS(null, "d", "M 0 0 L 10 5 L 0 10 L 2 5 z");
      }

      if (markerType === "Convoy" && size === "Small") {
     markerContent.setAttributeNS(null, "fill", "#FFFFFF");
      } else {
      markerContent.setAttributeNS(null, "fill", color);
	  }
      markerContent.setAttributeNS(null, "stroke", "none");

      document
        .getElementById(color.substring(1) + size + markerType + "Marker")
        .appendChild(markerContent);
    }
  };

  that.adjustCollideArrow = function (point, vector, distance, ending) {
    let xComponent, yComponent;

    if (ending === true) {
      xComponent = vector.p2.x - vector.p1.x;
      yComponent = vector.p2.y - vector.p1.y;
    } else if (ending === false) {
      xComponent = vector.p1.x - vector.p2.x;
      yComponent = vector.p1.y - vector.p2.y;
    } 

    const magnitude = Math.sqrt(xComponent ** 2 + yComponent ** 2);

    const unitVector = {
      x: xComponent / magnitude,
      y: yComponent / magnitude,
    };

    const perpendicularVector = {
      x: -unitVector.y,
      y: unitVector.x,
    };
    const displacementVector = {
      x: perpendicularVector.x * distance,
      y: perpendicularVector.y * distance,
    };

    if (ending === true) {
      point.x = point.x + displacementVector.x;
      point.y = point.y + displacementVector.y;
    } else {
      point.x = point.x - displacementVector.x;
      point.y = point.y - displacementVector.y;
    }

    return point;
  };

  that.addConvoyArrow = function (
    provs,
    color,
    border,
    opts = {},
    collides,
    markerType
  ) {
    // Remove the MoveViaConvoy to keep the provinces only
    provs.splice(1, 1);

    const centers = provs.map((prov) => that.centerOf(prov));

    //Define the arrow definitions

    var spacer = 12;
    var startVec = new that.Vec(centers[0], centers[1]);
    var endVec = new that.Vec(
      centers[centers.length - 2],
      centers[centers.length - 1]
    );

    //Adjust the arrowStart, middle and ArrowEnd in case of collision

    var arrowStart = centers[0];

    arrowStart.x = centers[0].x + startVec.dir().mul(spacer).x;
    arrowStart.y = centers[0].y + startVec.dir().mul(spacer).y;

    var arrowEnd = centers[centers.length - 1];

    arrowEnd.x =
      centers[centers.length - 1].x - endVec.dir().mul(spacer * 1.5).x;
    arrowEnd.y =
      centers[centers.length - 1].y - endVec.dir().mul(spacer * 1.5).y;

    /*
		if (collides && provs.length === 2) {
			//Adjust for MOVE
			arrowStart = that.adjustCollideArrow(arrowStart, startVec, collideDistance, true);
			middle = that.adjustCollideArrow(middle, startVec, (collideDistance), true);
			arrowEnd = that.adjustCollideArrow(arrowEnd, endVec, collideDistance, false);

		} else if (collides && provs.length === 3) {
			//Adjust for SUPPORT
			arrowStart = that.adjustCollideArrow(arrowStart, startVec, collideDistance, true);
			middle = that.adjustCollideArrow(middle, endVec, (collideDistance), false); //TODO: find the right middle point
			arrowEnd = that.adjustCollideArrow(arrowEnd, endVec, collideDistance, false);
		}
*/

    //	Create the background arrow

    that.invokeMarker(border, true, "Arrow");
    var path = document.createElementNS(SVG, "path");
    path.setAttribute(
      "style",
      "fill: none;stroke: #000000;stroke-width:8 ;stroke-dasharray: 0 0; marker-end: url(#" +
        border.substring(1) +
        "LargeArrowMarker)"
    );

    const curveCommands = [];
    for (let i = 1; i < centers.length - 1; i++) {
      const prevCenter = centers[i - 1];
      const currentCenter = centers[i];
      const nextCenter = centers[i + 1];
      const middle = {
        x: (currentCenter.x + nextCenter.x) / 2,
        y: (currentCenter.y + nextCenter.y) / 2,
      };
      var command;
      if (i === centers.length - 2) {
        command =
          "Q " +
          currentCenter.x +
          " " +
          currentCenter.y +
          " " +
          nextCenter.x +
          " " +
          nextCenter.y;
      } else {
        command =
          "Q " +
          currentCenter.x +
          " " +
          currentCenter.y +
          " " +
          middle.x +
          " " +
          middle.y;
      }
      curveCommands.push(command);
    }

    var d =
      "M " + centers[0].x + " " + centers[0].y + " " + curveCommands.join(" ");

    path.setAttribute("d", d);
    $(el).find("#orders")[0].appendChild(path);

    //Create the coloured foreground
    that.invokeMarker(color, false, "Arrow");
    var colorPath = document.createElementNS(SVG, "path");

    colorPath.setAttribute(
      "style",
      "fill: none;stroke:" +
        color +
        ";stroke-width:3;stroke-dasharray: 0 0;" +
        "; marker-end: url(#" +
        color.substring(1) +
        "SmallArrowMarker)"
    );

    colorPath.setAttribute("d", d);
    $(el).find("#orders")[0].appendChild(colorPath);
  };

  that.addConvoySupport = function (
    provs,
    color,
    border,
    opts = {},
    collides,
    markerType
  ) {
    // Remove the MoveViaConvoy to keep the provinces only
    provs.splice(1, 1);

    let currentProv = provs.shift();

    let isConvoyPart = false;
    let destinationProv = "";
    let loc = "";
    for (let i = 0; i < provs.length; i++) {
      if (provs[i] === currentProv) {
        isConvoyPart = true;

        if (i === 1 && provs.length === 3) {
          // only province
          const curveStart = that.centerOf(provs[i - 1]);
          const curveMiddle = that.centerOf(currentProv);
          const curveEnd = that.centerOf(provs[i + 1]);

          loc = curveStart;
          loc.x = (curveStart.x + 2 * curveMiddle.x + curveEnd.x) / 4;
          loc.y = (curveStart.y + 2 * curveMiddle.y + curveEnd.y) / 4;
        } else if (i === provs.length - 2) {
          // Last province
          const curveStart = {
            x:
              (that.centerOf(provs[provs.length - 3]).x +
                that.centerOf(provs[provs.length - 2]).x) /
              2,
            y:
              (that.centerOf(provs[provs.length - 3]).y +
                that.centerOf(provs[provs.length - 2]).y) /
              2,
          };

          const curveMiddle = that.centerOf(provs[provs.length - 2]);
          const curveEnd = that.centerOf(provs[provs.length - 1]);

          loc = curveStart;
          loc.x = (curveStart.x + 2 * curveMiddle.x + curveEnd.x) / 4;
          loc.y = (curveStart.y + 2 * curveMiddle.y + curveEnd.y) / 4;
        } else if (i === 1) {
          // First province
          const curveStart = that.centerOf(provs[i - 1]);
          const curveMiddle = that.centerOf(currentProv);
          const curveEnd = {
            x: (that.centerOf(provs[i]).x + that.centerOf(provs[i + 1]).x) / 2,
            y: (that.centerOf(provs[i]).y + that.centerOf(provs[i + 1]).y) / 2,
          };

          loc = curveStart;
          loc.x = (curveStart.x + 2 * curveMiddle.x + curveEnd.x) / 4;
          loc.y = (curveStart.y + 2 * curveMiddle.y + curveEnd.y) / 4;
        } else {
          // Middle province

          const curveStart = {
            x:
              (that.centerOf(provs[provs.length - 3]).x +
                that.centerOf(provs[provs.length - 2]).x) /
              2,
            y:
              (that.centerOf(provs[provs.length - 3]).y +
                that.centerOf(provs[provs.length - 2]).y) /
              2,
          };

          const curveMiddle = that.centerOf(provs[i]);
          const curveEnd = {
            x: (that.centerOf(provs[i]).x + that.centerOf(provs[i + 1]).x) / 2,
            y: (that.centerOf(provs[i]).y + that.centerOf(provs[i + 1]).y) / 2,
          };

          loc = curveStart;
          loc.x = (curveStart.x + 2 * curveMiddle.x + curveEnd.x) / 4;
          loc.y = (curveStart.y + 2 * curveMiddle.y + curveEnd.y) / 4;
        }

        break;
      }
    }

    if (isConvoyPart) {
      let origin = that.centerOf(currentProv);
      let destination = loc; // TODO wrong

      //Define the arrow definitions

      var spacer = 12;
      var vec = new that.Vec(origin, destination);

      //Adjust the arrowStart, middle and ArrowEnd in case of collision

      let arrowStart = origin;
      let arrowEnd = destination;

      //  arrowStart.x = arrowStart.x + vec.dir().mul(spacer).x;
      //  arrowStart.y = arrowStart.y + vec.dir().mul(spacer).y;

      //  arrowEnd.x =
      //    destination.x - vec.dir().mul(spacer * 1.5).x;
      //  arrowEnd.y =
      //    destination.y - vec.dir().mul(spacer * 1.5).y;

      //	Create the background arrow

      that.invokeMarker(border, true, "Convoy");
      var path = document.createElementNS(SVG, "path");
      path.setAttribute(
        "style",
        "fill: none;stroke: #000000;stroke-width:8 ;stroke-dasharray: 3 3 1 3; marker-end: url(#" +
          border.substring(1) +
          "LargeConvoyMarker)"
      );


      var d =
        "M " +
        arrowStart.x +
        " " +
        arrowStart.y +
        " L " +
        arrowEnd.x +
        " " +
        arrowEnd.y;

      path.setAttribute("d", d);

      $(el).find("#orders")[0].appendChild(path);

      //Create the coloured foreground
      that.invokeMarker(color, false, "Convoy");
      var colorPath = document.createElementNS(SVG, "path");

      colorPath.setAttribute(
        "style",
        "fill: none;stroke:" +
          color +
          ";stroke-width:3;stroke-dasharray: 3 3 1 3;" +
          "; marker-end: url(#" +
          color.substring(1) +
          "SmallConvoyMarker)"
      );

      colorPath.setAttribute("d", d);
      $(el).find("#orders")[0].appendChild(colorPath);
    }
  };

  that.addArrow = function (
    provs,
    color,
    border,
    opts = {},
    collides,
    markerType
  ) {
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
    var collideDistance = 5;
    var startVec = new that.Vec(start, middle);
    var endVec = new that.Vec(middle, end);

    //Adjust the arrowStart, middle and ArrowEnd in case of collision

    var arrowStart = start;

    arrowStart.x = start.x + startVec.dir().mul(spacer).x;
    arrowStart.y = start.y + startVec.dir().mul(spacer).y;

    var arrowEnd = end;

    arrowEnd.x = end.x - endVec.dir().mul(spacer * 1.5).x;
    arrowEnd.y = end.y - endVec.dir().mul(spacer * 1.5).y;

    if (collides && provs.length === 2) {
      //Adjust for MOVE
      arrowStart = that.adjustCollideArrow(
        arrowStart,
        startVec,
        collideDistance,
        true
      );
      middle = that.adjustCollideArrow(middle, startVec, collideDistance, true);
      arrowEnd = that.adjustCollideArrow(
        arrowEnd,
        endVec,
        collideDistance,
        false
      );
    } else if (collides && provs.length === 3) {
      //Adjust for SUPPORT
      arrowStart = that.adjustCollideArrow(
        arrowStart,
        startVec,
        collideDistance,
        true
      );
      middle = that.adjustCollideArrow(middle, endVec, collideDistance, false); //TODO: find the right middle point
      arrowEnd = that.adjustCollideArrow(
        arrowEnd,
        endVec,
        collideDistance,
        false
      );
    }

    //Select whether the arrow is solid (move) or dashed (support)
    if (provs.length === 3 || markerType === "Support") {
      var supportBorderStrokeDashArray = "3 2";
    } else {
      var supportBorderStrokeDashArray = "0 0";
    }

    //TODO Joren: Arrow widths used to be 10/4, might be 8/3. To check if 10/4 might work better with units ON TOP OF orders

    //	Create the background arrow
    const SVG_NS = "http://www.w3.org/2000/svg";

    const createPathElement = (
      markerType,
      border,
      strokeDashArray,
      markerSuffix
    ) => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute(
        "style",
        `fill: none; stroke: ${border}; stroke-width: 8; stroke-dasharray: ${strokeDashArray}; marker-end: url(#${border.substring(
          1
        )}Large${markerType}${markerSuffix})`
      );
      return path;
    };

    const createSupportPath = (border, strokeDashArray) => {
      return createPathElement("Support", border, strokeDashArray, "Marker");
    };

    const createArrowPath = (border, strokeDashArray) => {
      return createPathElement("Arrow", border, strokeDashArray, "Marker");
    };

    const addPathToOrders = (el, path) => {
      el.querySelector("#orders").appendChild(path);
    };

    const drawArrowPath = (
      el,
      arrowStart,
      middle,
      arrowEnd,
      border,
      supportBorderStrokeDashArray,
      markerType
    ) => {
      const path =
        markerType === "Support"
          ? createSupportPath(border, supportBorderStrokeDashArray)
          : createArrowPath(border, supportBorderStrokeDashArray);
      path.setAttribute(
        "d",
        `M${arrowStart.x} ${arrowStart.y} Q ${middle.x} ${middle.y} ${arrowEnd.x} ${arrowEnd.y}`
      );
      addPathToOrders(el, path);
    };

    if (markerType === "Support") {
      that.invokeMarker(border, true, "Support");
    } else {
      that.invokeMarker(border, true, "Arrow");
    }

    drawArrowPath(
      el,
      arrowStart,
      middle,
      arrowEnd,
      border,
      supportBorderStrokeDashArray,
      markerType
    );

    //Create the coloured foreground
    if (markerType === "Support") {
      that.invokeMarker(color, false, "Support");
    } else {
      that.invokeMarker(color, false, "Arrow");
    }
    var colorPath = document.createElementNS(SVG, "path");
    if (markerType === "Support") {
      colorPath.setAttribute(
        "style",
        "fill: none;stroke:" +
          color +
          ";stroke-width:3;stroke-dasharray:" +
          supportBorderStrokeDashArray +
          ";" +
          "; marker-end: url(#" +
          color.substring(1) +
          "SmallSupportMarker)"
      );
    } else {
      colorPath.setAttribute(
        "style",
        "fill: none;stroke:" +
          color +
          ";stroke-width:3;stroke-dasharray:" +
          supportBorderStrokeDashArray +
          ";" +
          "; marker-end: url(#" +
          color.substring(1) +
          "SmallArrowMarker)"
      );
    }

    var d =
      "M" +
      arrowStart.x +
      " " +
      arrowStart.y +
      " Q " +
      middle.x +
      " " +
      middle.y +
      " " +
      arrowEnd.x +
      " " +
      arrowEnd.y;
    colorPath.setAttribute("d", d);
    $(el).find("#orders")[0].appendChild(colorPath);
  };
  that.addPlus = function (province, color, opts = {}) {
    var loc = that.centerOf(province);
    var size = 16;
    var lineWidth = size / 10;
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
    var d =
      "M " +
      (loc.x + size) +
      "," +
      (loc.y + (size / 2 + lineWidth)) +
      " H " +
      (loc.x + (size / 2 + lineWidth)) +
      " V " +
      (loc.y + size) +
      " H " +
      (loc.x + (size / 2 - lineWidth)) +
      " V " +
      (loc.y + (size / 2 + lineWidth)) +
      " H " +
      loc.x +
      " V " +
      (loc.y + (size / 2 - lineWidth)) +
      " H " +
      (loc.x + (size / 2 - lineWidth)) +
      " V " +
      loc.y +
      " H " +
      (loc.x + (size / 2 + lineWidth)) +
      " V " +
      (loc.y + (size / 2 - lineWidth)) +
      " H " +
      (loc.x + size) +
      " Z ";
    path.setAttribute("d", d);
    $(el).find("#orders")[0].appendChild(path);
  };
  that.addCross = function (provs, color, opts = {}, collides) {
    var loc = null;

    if (!Array.isArray(provs)) {
      loc = that.centerOf(provs);
    } else if (provs.length === 3 && provs[1] === provs[2]) {
      provs.pop();
    }

    if (Array.isArray(provs) && provs.length === 2) {
      var start = that.centerOf(provs[0]);
      var end = that.centerOf(provs[1]);
      loc = start.add(end.sub(start).div(1.9));
      var vector = new that.Vec(start, end);

      if (collides) {
        loc = that.adjustCollideArrow(loc, vector, 5, true);
      }
    } else if (Array.isArray(provs) && provs.length === 3) {
      //Create the point for the arrow if a curve
      var start = that.centerOf(provs[0]);
      var middle = that.centerOf(provs[1]);
      var end = that.centerOf(provs[2]);

      loc = start;
      loc.x = (4 / 9) * start.x + (4 / 9) * middle.x + (1 / 9) * end.x;
      loc.y = (4 / 9) * start.y + (4 / 9) * middle.y + (1 / 9) * end.y;
    }

    var bound = 6;
    var width = 2;
    loc.x -= 0;
    loc.y -= 0;

    var path = document.createElementNS(SVG, "path");
    path.setAttribute(
      "style",
      "fill:" +
        color +
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
    $(el).find("#orders")[0].appendChild(path);
  };
  that.removeOrders = function () {
    $(el).find("#orders").empty();
  };
  that.addOrder = function (order, color, opts = {}, success, collides) {
    //Define the border based on order success
    if (success) {
      var border = "#000000";
    } else {
      var border = "#FB6C6C";
    }
    var error = "#FB6C6C";

    //Create the order
    if (order[1] === "Hold") {
      that.addBox(order[0], 8, color, opts);
    } else if (order[1] === "Move") {
      that.addArrow([order[0], order[2]], color, border, opts, collides);
    } else if (order[1] === "MoveViaConvoy") {
      that.addConvoyArrow(order, color, border, opts);
      that.addBox(order[0], 3, color, opts);
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
      that.addPlus(order[0], color, opts);
    } else if (order[1] === "Disband") {
      that.addCross(order[0], error, opts);
      //TODO: Need to make this unit black - but how?
      //			that.addBox(order[0], 4, color, opts);
    } else if (order[1] === "Convoy") {
      that.addBox(order[0], 3, color, opts);
      that.addConvoySupport(order, color, border, opts);
      //that.addArrow([order[2], order[0], order[3]], color, border, opts);
    } else if (order[1] === "Support") {
      var markerType = "Arrow";
      if (order[2] === order[3]) {
        markerType = "Support";
      }
      if (order.length === 3) {
        //that.addBox(order[0], 4, color, opts);
        that.addArrow(
          [order[2], order[3]],
          color,
          border,
          opts,
          collides,
          markerType
        );
      } else {
        //that.addBox(order[0], 4, color);
        that.addArrow(
          [order[0], order[2], order[3]],
          color,
          border,
          opts,
          collides,
          markerType
        );
      }
    }

    //If order failed, add the cross in the right location.
    //TODO: Hold fail, Convoy fail, MoveViaConvoy fail
    if (!success) {
      if (order[1] === "Move") {
        that.addCross([order[0], order[2]], error, opts, collides);
      } else if (order[1] === "Support") {
        that.addCross([order[0], order[2], order[3]], error, opts, collides);
      } else if (order[1] === "Hold") {
        that.addCross(order[0], error, opts);
        console.log(
          "ORDER IS HELD HERE11111111111111111111111111111111111111111111"
        ); //TODO after Martin fixes this stuff to have the adjucator show failed holds, we can put it in here.
      }
    }
  };

  that.removeUnits = function (layer) {
    if (typeof layer === "undefined") {
      layer = "#units";
    }
    $(el).find(layer).empty();
  };
  that.addUnit = function (
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
      unit.attr("id", sourceId + province);
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
      unit.attr(
        "id",
        sourceId + province //TODO: need to give this an ID so we can target it when it gets dislodged
      );
    }
    $(el).find(layer).eq(0).append($(shadow).eq(0));
    $(el).find(layer).eq(0).append($(unit).eq(0));
  };
  return that;
}
