import $ from "jquery";

type Province = string;
type Order = [string, string, string | undefined, string | undefined];
type AddClickListenerOptions = {
  noHighlight?: boolean;
  permanent?: boolean;
  touch?: boolean;
};
type DrawOptions = {
  stroke?: string;
};

const SVG_NAMESPACE_URI = "http://www.w3.org/2000/svg";

const ARROW_BOUND_F = 3;
// TODO rename when understood
const ARROW_HEAD_F1_MULTIPLIER = 3;
const ARROW_HEAD_F2_MULTIPLIER = 6;
const ARROW_SPACER_MULTIPLIER = 2;
const ARROW_STROKE_WIDTH = 0.5;
const ARROW_STROKE_MITER_LIMIT = 4;
const ARROW_STROKE_OPACITY = 1.0;
const ARROW_FILL_OPACITY = 0.7;

const BOX_ORIGIN_OFFSET = 3;
const BOX_FILL_RULE = "evenodd";
const BOX_STROKE_WIDTH = 0.5;
const BOX_STROKE_MITER_LIMIT = 4;
const BOX_STROKE_OPACITY = 1.0;
const BOX_FILL_OPACITY = 0.9;

const CROSS_ORIGIN_OFFSET = 3;
const CROSS_BOUND = 14;
const CROSS_WIDTH = 4;
const CROSS_STROKE_WIDTH = 0.5;
const CROSS_STROKE_MITER_LIMIT = 4;
const CROSS_STROKE_OPACITY = 1.0;
const CROSS_FILL_OPACITY = 0.9;

const DISLODGED_OFFSET = 5;
const DISLODGED_OPACITY = 0.73;

const UNIT_STROKE_WIDTH = 1;
const UNIT_STROKE_MITER_LIMIT = 4;
const UNIT_STROKE_OPACITY = 1;
const UNIT_STROKE_DASHARRAY = "none";

// TODO test
const getSvg = (container: JQuery<HTMLElement>): SVGSVGElement => {
  const elements = container.find("svg");
  if (elements.length <= 0)
    throw Error("Could not find svg element in container");
  return elements[0];
};

export class Point {
  // TODO docstring
  x: number;
  y: number;

  // TODO test
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // TODO test
  add(point: Point): Point {
    // TODO docstring
    return new Point(this.x + point.x, this.y + point.y);
  }

  // TODO test
  subtract(point: Point): Point {
    // TODO docstring
    return new Point(this.x - point.x, this.y - point.y);
  }

  // TODO test
  length(): number {
    // TODO docstring
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  // TODO test
  divide(divisor: number): Point {
    // TODO docstring
    return new Point(this.x / divisor, this.y / divisor);
  }

  // TODO test
  multiply(multiplier: number): Point {
    // TODO docstring
    return new Point(this.x * multiplier, this.y * multiplier);
  }

  // TODO test
  orth(): Point {
    // TODO docstring
    return new Point(-this.y, this.x);
  }
}

export class Vector {
  // TODO docstring
  p1: Point;
  p2: Point;

  // TODO test
  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  // TODO test
  length() {
    // TODO docstring
    return this.p2.subtract(this.p1).length();
  }

  // TODO test
  direction() {
    // TODO docstring
    return this.p2.subtract(this.p1).divide(this.length());
  }

  // TODO test
  orth() {
    // TODO docstring
    return this.direction().orth();
  }
}

export class DippyMap {
  container: JQuery<HTMLElement>;
  svgEl: SVGSVGElement;
  clickListenerRemovers: (() => any)[] = [];

  constructor(container: JQuery<HTMLElement>) {
    this.container = container;
    this.svgEl = getSvg(container);
  }

  addReadyAction(cb: () => any) {
    cb();
  }

  selEscape(province: Province) {}

  // TODO test
  centerOf(province: Province): Point {
    // TODO docstring
    var center = $(this.svgEl)
      .find("#" + this.selEscape(province) + "Center")
      .first();
    var match = /^m\s+([\d-.]+),([\d-.]+)\s+/.exec(
      center.attr("d") as string
    ) as RegExpExecArray;
    var x = Number(match[1]);
    var y = Number(match[2]);
    var parentTransform = center.parent().attr("transform");
    if (parentTransform != null) {
      var transMatch = /^translate\(([\d.eE-]+),\s*([\d.eE-]+)\)$/.exec(
        parentTransform
      ) as RegExpExecArray;
      x += Number(transMatch[1]) - 1.5;
      y += Number(transMatch[2]) - 2;
    }
    return new Point(x, y);
  }

  showProvinces() {
    $(this.svgEl).find("#provinces")[0].removeAttribute("style");
  }
  // TODO test
  copySvg(sourceId: string) {
    // TODO docstring
    var source = $("#" + sourceId + " svg")
      .first()
      .clone();
    this.container[0].innerHTML = "";
    this.container[0].appendChild(source[0]);
    this.svgEl = this.container.find("svg")[0];
  }

  // TODO test
  colorSC(province: Province, color: string) {
    // TODO docstring
    $(this.svgEl).find("#" + province + "Center")[0].style.stroke = color;
  }

  // TODO test
  colorProvince(province: Province, color: string) {
    // TODO docstring
    var path = $(this.svgEl).find("#" + this.selEscape(province))[0];
    path.removeAttribute("style");
    path.setAttribute("fill", color);
    path.setAttribute("fill-opacity", "0.8"); // TODO remove hard coding
  }

  // TODO test
  hideProvince(province: Province) {
    // TODO docstring
    var path = $(this.svgEl).find("#" + this.selEscape(province))[0];
    path.removeAttribute("style");
    path.setAttribute("fill", "#ffffff");
    path.setAttribute("fill-opacity", "0"); // TODO remove hard coding
  }

  // TODO test
  highlightProvince(province: Province) {
    // TODO docstring
    // TODO fix var names
    var prov = $(this.svgEl)
      .find("#" + this.selEscape(province))
      .first();
    var copy = prov.clone()[0];
    copy.setAttribute("id", prov.attr("id") + "_highlight");
    copy.setAttribute("style", "fill:url(#stripes)");
    copy.setAttribute("fill-opacity", "1");
    copy.removeAttribute("transform");
    var curr: HTMLElement | null = prov[0];
    while (curr != null && curr.getAttribute != null) {
      var trans = curr.getAttribute("transform");
      if (trans != null) {
        copy.setAttribute("transform", trans);
      }
      curr = curr.parentElement;
    }
    copy.setAttribute("stroke", "none");
    $(this.svgEl).find("#highlights")[0].appendChild(copy);
  }

  // TODO test
  unhighlightProvince(province: Province) {
    // TODO docstring
    $(this.svgEl)
      .find("#" + this.selEscape(province) + "_highlight")
      .remove();
  }

  // TODO test
  clearClickListeners() {
    // TODO docstring
    this.clickListenerRemovers.forEach((fn) => fn());
  }

  // TODO test
  getTranslate(element: HTMLElement): [number, number] {
    // TODO docstring
    let x = 0;
    let y = 0;

    let tempElement: HTMLElement | null = element;
    while (tempElement) {
      var transform = tempElement.getAttribute("transform");
      if (transform != null) {
        var transformMatch = /^translate\(([\d.eE-]+),\s*([\d.eE-]+)\)$/.exec(
          transform
        ) as RegExpExecArray;
        x += Number(transformMatch[1]);
        y += Number(transformMatch[2]);
      }
      tempElement = tempElement.parentElement;
    }
    return [x, y];
  }

  // TODO test
  addClickListener(
    province: Province,
    handler: (province: Province) => any,
    options: AddClickListenerOptions
  ) {
    // TODO docstring
    const { noHighlight, permanent, touch } = options;
    if (!noHighlight) {
      this.highlightProvince(province);
    }
    // TODO rename
    const prov = $(this.svgEl)
      .find("#" + this.selEscape(province))
      .first();

    // TODO dedupe?
    const copy = prov.clone()[0];

    const [x, y] = this.getTranslate(copy);
    // TODO sub-method
    copy.setAttribute("id", prov.attr("id") + "_click");
    copy.setAttribute("style", "fill:#000000;fill-opacity:0;stroke:none;"); // TODO remove hard coding
    copy.setAttribute("stroke", "none");
    copy.setAttribute("transform", "translate(" + x + "," + y + ")");
    copy.removeAttribute("transform");
    this.svgEl.appendChild(copy);

    const clickHandler = () => handler(province);
    $(copy).on("click", clickHandler);

    if (touch) {
      this.addTouchHandlers(copy, clickHandler, province, options);
    }
  }

  // TODO test
  addTouchHandlers(
    element: HTMLElement,
    handler: () => void,
    province: Province,
    options: AddClickListenerOptions
  ) {
    // TODO docstring
    // TODO clean up logic
    const { noHighlight, permanent } = options;
    const touchstartHandler = (e: any) => {
      e.preventDefault();
      let touchendHandler: false | ((e: any) => void) = false;
      let touchmoveHandler: false | ((e: any) => void) = false;
      var moved: boolean = false;
      var at: number = new Date().getTime();
      function unregisterTouchHandlers() {
        $(element).off("touchend", touchendHandler);
        $(element).off("touchmove", touchmoveHandler);
      }
      touchendHandler = (e) => {
        if (!moved || new Date().getTime() - at < 300) {
          handler();
        }
        unregisterTouchHandlers();
      };
      $(element).on("touchend", touchendHandler);
      touchmoveHandler = function (e) {
        moved = true;
      };
      $(element).on("touchmove", touchmoveHandler);
    };
    $(element).on("touchstart", touchstartHandler);
    if (!permanent) {
      const remover = () => {
        if (!noHighlight) {
          this.unhighlightProvince(province);
        }
        if ((options || {}).touch) {
          $(element).on("touchstart", touchstartHandler);
        }
        $(element).on("click", handler);
      };

      this.clickListenerRemovers.push(remover);
    }
  }

  // TODO test
  createSvgPathElement(
    path: string,
    style: { [key: string]: string | null }
  ): SVGPathElement {
    // TODO docstring
    const pathElement = document.createElementNS(SVG_NAMESPACE_URI, "path");
    pathElement.setAttribute("d", path);
    Object.entries(style).forEach(([attributeName, value]) => {
      pathElement.style.setProperty(attributeName, value);
    });
    return pathElement;
  }

  // TODO test
  addBox(
    province: Province,
    corners: number,
    color: string,
    options: DrawOptions = { stroke: "#000000" }
  ) {
    // TODO docstring
    const provinceCenter = this.centerOf(province);
    const boxOrigin = new Point(
      provinceCenter.x - BOX_ORIGIN_OFFSET,
      provinceCenter.y - BOX_ORIGIN_OFFSET
    );
    // TODO huh?
    const all = Math.PI * 2;
    const step = all / corners;
    let startAngle = Math.PI * 1.5;

    if (corners % 2 === 0) {
      startAngle += step / 2;
    }

    let angle = startAngle;

    let d = "";
    const getXPos = (point: Point, angle: number, boundF: number): number => {
      return point.x + Math.cos(angle) * boundF;
    };
    const getYPos = (point: Point, angle: number, boundF: number): number => {
      return point.y + Math.sin(angle) * boundF;
    };
    const subBox = (boundF: number) => {
      d += `M  ${getXPos(boxOrigin, angle, boundF)}, ${getYPos(
        boxOrigin,
        angle,
        boundF
      )}`;
      for (var i = 1; i < corners; i++) {
        angle += step;
        d += `L  ${getXPos(boxOrigin, angle, boundF)}, ${getYPos(
          boxOrigin,
          angle,
          boundF
        )}`;
      }
      d += " z";
    };

    subBox(27);
    subBox(20);

    const style = {
      fill: color,
      stroke: options.stroke || "#000000",
      // TODO replace with type
      ["fill-rule"]: BOX_FILL_RULE,
      ["stroke-width"]: BOX_STROKE_WIDTH.toString(),
      ["stroke-miterlimit"]: BOX_STROKE_MITER_LIMIT.toString(),
      ["stroke-opacity"]: BOX_STROKE_OPACITY.toString(),
      ["fill-opacity"]: BOX_FILL_OPACITY.toString(),
    };

    const path = this.createSvgPathElement(d, style);
    $(this.svgEl).find("#orders")[0].appendChild(path);
  }

  // TODO test
  getArrowPoints = (provinces: Province[]): [Point, Point, Point] => {
    // TODO docstring
    // If support to hold, draw single arrow
    if (provinces.length === 3 && provinces[1] === provinces[2]) {
      provinces.pop();
    }
    if (provinces.length === 2) {
      const start = this.centerOf(provinces[0]);
      const end = this.centerOf(provinces[1]);
      const middle = start.add(end.subtract(start).divide(2.0));
      return [start, middle, end];
    } else {
      const start = this.centerOf(provinces[0]);
      const middle = this.centerOf(provinces[1]);
      const end = this.centerOf(provinces[2]);
      return [start, middle, end];
    }
  };

  // TODO test
  createPoint(val1: number, val2: number, letter: string = "L") {
    return `${letter} ${val1},${val2}`;
  }

  // TODO test
  createControlPoint(control: Point, end: Point) {
    const { x: cx, y: cy } = control;
    const { x, y } = end;
    return "C " + [cx, cy, cx, cy, x, y].join(",");
  }

  // TODO test
  addArrow(provinces: Province[], color: string, options: DrawOptions) {
    // TODO docstring
    const [start, middle, end] = this.getArrowPoints(provinces);

    var boundF = ARROW_BOUND_F;
    var headF1 = boundF * ARROW_HEAD_F1_MULTIPLIER;
    var headF2 = boundF * ARROW_HEAD_F2_MULTIPLIER;
    var spacer = boundF * ARROW_SPACER_MULTIPLIER;

    const v1 = new Vector(start, middle);
    const v2 = new Vector(middle, end);

    // TODO explain
    const start0 = start
      .add(v1.direction().multiply(spacer))
      .add(v1.orth().multiply(boundF));

    // TODO explain
    var start1 = start
      .add(v1.direction().multiply(spacer))
      .subtract(v2.orth().multiply(boundF));

    // TODO explain
    var sumOrth = v1.orth().add(v1.orth());
    var avgOrth = sumOrth.divide(sumOrth.length());

    // TODO explain
    var control0 = middle.add(avgOrth.multiply(boundF));
    var control1 = middle.subtract(avgOrth.multiply(boundF));

    // TODO explain
    var end0 = end
      .subtract(v2.direction().multiply(spacer + headF2))
      .add(v2.orth().multiply(boundF));
    var end1 = end
      .subtract(v2.direction().multiply(spacer + headF2))
      .subtract(v2.orth().multiply(boundF));
    var end3 = end.subtract(v2.direction().multiply(spacer));

    // TODO explain
    var head0 = end0.add(v2.orth().multiply(headF1));
    var head1 = end1.subtract(v2.orth().multiply(headF1));

    const points = [
      this.createPoint(start0.x, start0.y, "M"),
      this.createControlPoint(control0, end0),
      this.createPoint(head0.x, head0.y),
      this.createPoint(end3.x, end3.y),
      this.createPoint(head1.x, head1.y),
      this.createPoint(end1.x, end1.y),
      this.createControlPoint(control1, start1),
      "z",
    ];
    const d = points.join(" ");

    const style = {
      fill: color,
      stroke: options.stroke || "#000000",
      ["stroke-width"]: ARROW_STROKE_WIDTH.toString(),
      ["stroke-miterlimit"]: ARROW_STROKE_MITER_LIMIT.toString(),
      ["stroke-opacity"]: ARROW_STROKE_OPACITY.toString(),
      ["fill-opacity"]: ARROW_FILL_OPACITY.toString(),
    };

    const path = this.createSvgPathElement(d, style);
    $(this.svgEl).find("#orders")[0].appendChild(path);
  }

  addCross(province: Province, color: string, options: DrawOptions) {
    var bound = CROSS_BOUND;
    var width = CROSS_WIDTH;
    const provinceCenter = this.centerOf(province);
    const crossOrigin = new Point(
      provinceCenter.x - CROSS_ORIGIN_OFFSET,
      provinceCenter.y - CROSS_ORIGIN_OFFSET
    );

    const points = [
      this.createPoint(crossOrigin.x, crossOrigin.y + width, "M"),
      this.createPoint(crossOrigin.x + bound, crossOrigin.y + bound + width),
      this.createPoint(crossOrigin.x + bound + width, crossOrigin.y + bound),
      this.createPoint(crossOrigin.x + width, crossOrigin.y),
      this.createPoint(crossOrigin.x + bound + width, crossOrigin.y - bound),
      this.createPoint(crossOrigin.x + bound, crossOrigin.y - bound - width),
      this.createPoint(crossOrigin.x, crossOrigin.y - width),
      this.createPoint(crossOrigin.x - bound, crossOrigin.y - bound - width),
      this.createPoint(crossOrigin.x - bound - width, crossOrigin.y - bound),
      this.createPoint(crossOrigin.x - width, crossOrigin.y),
      this.createPoint(crossOrigin.x - bound - width, crossOrigin.y + bound),
      this.createPoint(crossOrigin.x - bound, crossOrigin.y + bound + width),
    ];
    const d = points.join(" ");

    const style = {
      fill: color,
      stroke: options.stroke || "#000000",
      ["stroke-width"]: CROSS_STROKE_WIDTH.toString(),
      ["stroke-miterlimit"]: CROSS_STROKE_MITER_LIMIT.toString(),
      ["stroke-opacity"]: CROSS_STROKE_OPACITY.toString(),
      ["fill-opacity"]: CROSS_FILL_OPACITY.toString(),
    };
    const path = this.createSvgPathElement(d, style);
    $(this.svgEl).find("#orders")[0].appendChild(path);
  }

  // TODO test
  removeOrders() {
    // TODO docstring
    $(this.svgEl).find("#orders").empty();
  }

  // TODO test
  addHold(province: Province, color: string, options: DrawOptions) {
    // TODO docstring
    this.addBox(province, 4, color, options);
  }

  // TODO test
  addMove(
    source: Province,
    target: Province,
    color: string,
    options: DrawOptions
  ) {
    // TODO docstring
    this.addArrow([source, target], color, options);
  }

  // TODO test
  addMoveViaConvoy(
    source: Province,
    target: Province,
    color: string,
    options: DrawOptions
  ) {
    // TODO docstring
    this.addArrow([source, target], color, options);
    this.addBox(source, 5, color, options);
  }

  // TODO test
  addConvoy(
    t1: Province,
    t2: Province,
    t3: Province,
    color: string,
    options: DrawOptions
  ) {
    // TODO docstring
    this.addBox(t1, 5, color, options);
    this.addArrow([t2, t1, t3], color, options);
  }

  // TODO test
  addSupport(
    t1: Province,
    t2: Province,
    t3: Province | undefined,
    color: string,
    options: DrawOptions
  ) {
    // TODO docstring
    if (t3) {
      this.addBox(t1, 3, color, options);
      this.addArrow([t1, t2, t3], color, options);
    } else {
      this.addBox(t1, 3, color, options);
      this.addArrow([t1, t2], color, options);
    }
  }

  // TODO test
  addDisband(province: Province, color: string, options: DrawOptions) {
    // TODO docstring
    this.addCross(province, color, options);
    this.addBox(province, 4, color, options);
  }

  addUnit(
    sourceId: string,
    province: string,
    color: string,
    dislodged: boolean,
    layer: string = "#units",
    options: DrawOptions
  ) {
    const shadowQuery = $("#" + sourceId)
      .find("#shadow")
      .first()
      .clone()[0];
    const hullQuery = $("#" + sourceId + " svg").find("#hull");
    const bodyQuery = $("#" + sourceId + " svg").find("#body");

    const provinceCenter = this.centerOf(province);

    let unit: HTMLElement;
    const opacity = dislodged ? DISLODGED_OPACITY : 1;
    let offsetX = dislodged ? DISLODGED_OFFSET : 0;
    let offsetY = dislodged ? DISLODGED_OFFSET : 0;

    if (hullQuery.length > 0) {
      unit = hullQuery.first().clone()[0];
      offsetX -= 65;
      offsetY -= 15;
    } else {
      unit = bodyQuery.first().clone()[0];
      offsetX -= 40;
      offsetY -= 5;
    }

    const unitOrigin = new Point(
      provinceCenter.x + offsetX,
      provinceCenter.y + offsetY
    );

    shadowQuery.setAttribute(
      "transform",
      "translate(" + unitOrigin.x + ", " + unitOrigin.y + ")"
    );
    unit.setAttribute(
      "transform",
      "translate(" + unitOrigin.x + ", " + unitOrigin.y + ")"
    );
    const style = {
      fill: color,
      ["fill-opacity"]: opacity.toString(),
      ["stroke"]: options.stroke || "#000000",
      ["stroke-width"]: UNIT_STROKE_WIDTH.toString(),
      ["stroke-miterlimit"]: UNIT_STROKE_MITER_LIMIT.toString(),
      ["stroke-opacity"]: UNIT_STROKE_OPACITY.toString(),
      ["stroke-dasharray"]: UNIT_STROKE_DASHARRAY,
    };
    Object.entries(style).forEach(([attributeName, value]) => {
      unit.style.setProperty(attributeName, value);
    });
    const layerElement = $(this.svgEl).find(layer)[0];
    layerElement.appendChild(shadowQuery);
    layerElement.appendChild(unit);
  }

  // TODO test
  removeUnits(layer: string = "#units") {
    // TODO docstring
    $(this.svgEl).find(layer).empty();
  }

  // TODO test
  addBuild(pieceType: string, province: Province, options: DrawOptions) {
    // TODO docstring
    const unit = "unit";
    const color = "#00000";
    const layer = "#orders";
    this.addUnit(unit + pieceType, province, color, false, layer, options);
  }

  // TODO test
  addOrder(order: Order, color: string, options: DrawOptions) {
    // TODO docstring
    const [t1, orderType, t2, t3] = order;
    if (orderType === "Hold") {
      this.addHold(t1, color, options);
    } else if (orderType === "Move") {
      this.addMove(t1, t2 as string, color, options);
    } else if (orderType === "MoveViaConvoy") {
      this.addMoveViaConvoy(t1, t2 as string, color, options);
    } else if (orderType === "Build") {
      this.addBuild(t2 as string, t1, options);
    } else if (orderType === "Disband") {
      this.addDisband(t1, color, options);
    } else if (orderType === "Convoy") {
      this.addConvoy(t1, t2 as string, t3 as string, color, options);
    } else if (orderType === "Support") {
      this.addSupport(t1, t2 as string, t3, color, options);
    }
  }
}
