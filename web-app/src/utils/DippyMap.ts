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

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y);
  }

  subtract(point: Point): Point {
    return new Point(this.x - point.x, this.y - point.y);
  }

  multiply(multiplier: number): Point {
    return new Point(this.x * multiplier, this.y * multiplier);
  }

  divide(divisor: number): Point {
    if (divisor === 0) throw Error("Divide by zero error");
    return new Point(this.x / divisor, this.y / divisor);
  }

  length(): number {
    /* Represents the distance between the point and 0, 0 */
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  orth(): Point {
    return new Point(-this.y, this.x);
  }
}

export class Vector {
  p1: Point;
  p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  length(): number {
    return this.p2.subtract(this.p1).length();
  }

  direction(): Point {
    return this.p2.subtract(this.p1).divide(this.length());
  }

  orth(): Point {
    return this.direction().orth();
  }
}

export class DippyMap {
  container: JQuery<HTMLElement>;
  svgEl: SVGSVGElement;
  clickListenerRemovers: (() => any)[] = [];

  constructor(container: JQuery<HTMLElement>) {
    this.container = container;
    this.svgEl = this.getSvg(container);
  }

  /**
   * Gets the point at the center of a province.
   *
   * The center of the province is determined by the position of the supply center.
   *
   * @param {Province} province
   * @return {*}  {Point}
   * @memberof DippyMap
   */
  centerOf(province: Province): Point {
    var center = this.getSC(province);
    var match = /^m\s+([\d-.]+),([\d-.]+)\s+/.exec(
      center.attr("d") as string
    ) as RegExpExecArray;
    let [x, y] = [Number(match[1]), Number(match[2])];
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

  /**
   * Removes any styles from the provinces layer.
   *
   * If provinces layer has display: none, this style will be removed.
   *
   * @memberof DippyMap
   */
  showProvinces() {
    this.getLayer("#provinces")[0].removeAttribute("style");
  }

  /**
   * Sets the color of the supply center of the given province
   *
   * @param {Province} province
   * @param {string} color
   * @memberof DippyMap
   */
  colorSC(province: Province, color: string) {
    this.getSC(province)[0].style.stroke = color;
  }

  /**
   * Sets the color of the given province and removes any existing styles.
   *
   * @param {Province} province
   * @param {string} color
   * @memberof DippyMap
   */
  colorProvince(province: Province, color: string) {
    var path = this.getProvince(province)[0];
    path.removeAttribute("style");
    path.setAttribute("fill", color);
    path.setAttribute("fill-opacity", "0.8"); // TODO remove hard coding
  }

  /**
   * Hides the given province by setting opacity to 0 and removing style.
   *
   * @param {Province} province
   * @memberof DippyMap
   */
  hideProvince(province: Province) {
    var path = this.getProvince(province)[0];
    path.removeAttribute("style");
    path.setAttribute("fill", "#ffffff");
    path.setAttribute("fill-opacity", "0");
  }

  /**
   * Highlights province by creating a new element with special styling and
   * appending to highlights layer.
   *
   * @param {Province} province
   * @memberof DippyMap
   */
  highlightProvince(province: Province) {
    const provinceJQuery = this.getProvince(province);
    const copy = provinceJQuery.clone()[0];

    copy.setAttribute("id", provinceJQuery.attr("id") + "_highlight");
    copy.setAttribute("style", "fill:url(#stripes)");
    copy.setAttribute("fill-opacity", "1");
    copy.removeAttribute("transform");
    copy.setAttribute("stroke", "none");

    // TODO Optimization: rather than looking up the tree until we hit the top,
    // we should just select the parent element we're looking for more explicitly.
    let current: HTMLElement | null = provinceJQuery[0];
    while (current != null && current.getAttribute != null) {
      const trans = current.getAttribute("transform");
      if (trans != null) {
        copy.setAttribute("transform", trans);
      }
      current = current.parentElement;
    }
    this.getHighlightsLayer()[0].appendChild(copy);
  }

  /**
   * Remove highlight path for the given province.
   *
   * @param {Province} province
   * @memberof DippyMap
   */
  unhighlightProvince(province: Province) {
    $(this.svgEl)
      .find("#" + this.selEscape(province) + "_highlight")
      .remove();
  }

  /**
   * Call every clickListenerRemove function that has been registered.
   *
   * @memberof DippyMap
   */
  clearClickListeners() {
    this.clickListenerRemovers.forEach((fn) => fn());
  }

  /**
   * Adds a click listener element for the province to the map.
   *
   * By default also creates a highlight element.
   *
   * @param {Province} province
   * @param {(province: Province) => any} handler
   * @param {AddClickListenerOptions} options
   * @memberof DippyMap
   */
  addClickListener(
    province: Province,
    handler: (province: Province) => any,
    options: AddClickListenerOptions
  ) {
    const { noHighlight, touch } = options;
    if (!noHighlight) this.highlightProvince(province);

    const provinceJQuery = this.getProvince(province);
    const copy = provinceJQuery.clone()[0];
    const clickHandler = () => handler(province);

    // Create click element
    const [x, y] = this.getTranslate(copy);
    copy.setAttribute("id", provinceJQuery.attr("id") + "_click");
    copy.setAttribute("style", "fill:#000000;fill-opacity:0;stroke:none;");
    copy.setAttribute("stroke", "none");
    copy.removeAttribute("transform");
    copy.setAttribute("transform", "translate(" + x + "," + y + ")");
    $(copy).on("click", clickHandler);

    // NOTE unlike highlights these aren't added to a specific layer
    this.svgEl.appendChild(copy);

    if (touch) {
      this.addTouchHandlers(copy, clickHandler, province, options);
    }
  }

  /**
   * Remove all orders from the map.
   *
   * @memberof DippyMap
   */
  removeOrders() {
    this.getLayer("#orders").empty();
  }

  /**
   * Removes all units from the map.
   *
   * @param {string} [layer="#units"]
   * @memberof DippyMap
   */
  removeUnits(layer: string = "#units") {
    this.getLayer(layer).empty();
  }

  // TODO test
  addForceDisband(province: Province) {
    this.addCross(province, "#ff6600", {}); // TODO remove hard coding
    this.addBox(province, 4, "#ff6600"); // TODO remove hard coding
  }

  // TODO test
  addResolution(province: Province) {
    this.addCross(province, "ff0000", {}); // TODO remove hard coding
  }

  // TODO test
  /**
   * Adds a unit to the map.
   *
   * @param {string} sourceId
   * @param {string} province
   * @param {string} color
   * @param {boolean} dislodged
   * @param {string} [layer="#units"]
   * @param {DrawOptions} options
   * @memberof DippyMap
   */
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



  /**
   * Adds an order to the map
   *
   * @param {Order} order
   * @param {string} color
   * @param {DrawOptions} options
   * @memberof DippyMap
   */
  addOrder(order: Order, color: string, options: DrawOptions) {
    // TODO test
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

  private getProvince(province: Province): JQuery<HTMLElement> {
    return $(this.svgEl)
      .find("#" + this.selEscape(province))
      .first();
  }

  private getSC(province: Province): JQuery<HTMLElement> {
    return $(this.svgEl)
      .find("#" + this.selEscape(province) + "Center")
      .first();
  }

  private getSvg(container: JQuery<HTMLElement>): SVGSVGElement {
    const elements = container.find("svg");
    if (elements.length <= 0)
      throw Error("Could not find svg element in container");
    return elements[0];
  }

  private selEscape(province: Province): string {
    return province.replace("/", "\\/");
  }

  private getHighlightsLayer(): JQuery<HTMLElement> {
    return $(this.svgEl).find("#highlights");
  }

  private getTranslate(element: HTMLElement): [number, number] {
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

  private addTouchHandlers(
    element: HTMLElement,
    handler: () => void,
    province: Province,
    options: AddClickListenerOptions
  ) {
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

  private createSvgPathElement(
    path: string,
    style: { [key: string]: string | null }
  ): SVGPathElement {
    const pathElement = document.createElementNS(SVG_NAMESPACE_URI, "path");
    pathElement.setAttribute("d", path);
    Object.entries(style).forEach(([attributeName, value]) => {
      pathElement.style.setProperty(attributeName, value);
    });
    return pathElement;
  }

  private addBox(
    province: Province,
    corners: number,
    color: string,
    options: DrawOptions = { stroke: "#000000" }
  ) {
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

  private getArrowPoints = (provinces: Province[]): [Point, Point, Point] => {
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

  private createPoint(val1: number, val2: number, letter: string = "L") {
    return `${letter} ${val1},${val2}`;
  }

  private createControlPoint(control: Point, end: Point) {
    const { x: cx, y: cy } = control;
    const { x, y } = end;
    return "C " + [cx, cy, cx, cy, x, y].join(",");
  }

  private addArrow(provinces: Province[], color: string, options: DrawOptions) {
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

  private addCross(province: Province, color: string, options: DrawOptions) {
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

  private addHold(province: Province, color: string, options: DrawOptions) {
    this.addBox(province, 4, color, options);
  }

  private addMove(
    source: Province,
    target: Province,
    color: string,
    options: DrawOptions
  ) {
    this.addArrow([source, target], color, options);
  }

  private addMoveViaConvoy(
    source: Province,
    target: Province,
    color: string,
    options: DrawOptions
  ) {
    this.addArrow([source, target], color, options);
    this.addBox(source, 5, color, options);
  }

  private addConvoy(
    t1: Province,
    t2: Province,
    t3: Province,
    color: string,
    options: DrawOptions
  ) {
    this.addBox(t1, 5, color, options);
    this.addArrow([t2, t1, t3], color, options);
  }

  private addSupport(
    t1: Province,
    t2: Province,
    t3: Province | undefined,
    color: string,
    options: DrawOptions
  ) {
    if (t3) {
      this.addBox(t1, 3, color, options);
      this.addArrow([t1, t2, t3], color, options);
    } else {
      this.addBox(t1, 3, color, options);
      this.addArrow([t1, t2], color, options);
    }
  }

  private addDisband(province: Province, color: string, options: DrawOptions) {
    this.addCross(province, color, options);
    this.addBox(province, 4, color, options);
  }

  private addBuild(
    pieceType: string,
    province: Province,
    options: DrawOptions
  ) {
    const unit = "unit";
    const color = "#00000";
    const layer = "#orders";
    this.addUnit(unit + pieceType, province, color, false, layer, options);
  }

  private getLayer(id: string): JQuery<HTMLElement> {
    return $(this.svgEl).find(id);
  }
}
