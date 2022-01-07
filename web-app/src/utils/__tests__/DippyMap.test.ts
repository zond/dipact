import $ from "jquery";

import { DippyMap, Point, Vector } from "../DippyMap";

describe("Point", () => {
  test("constructor", () => {
    const x = 0;
    const y = 1;
    const point = new Point(x, y);
    expect(point.x).toBe(x);
    expect(point.y).toBe(y);
  });
  test("add positives", () => {
    const point1 = new Point(1, 2);
    const point2 = new Point(3, 4);
    const result = point1.add(point2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });
  test("add negatives", () => {
    const point1 = new Point(-1, -2);
    const point2 = new Point(-3, -4);
    const result = point1.add(point2);
    expect(result.x).toBe(-4);
    expect(result.y).toBe(-6);
  });
  test("add positives and negatives", () => {
    const point1 = new Point(-1, -2);
    const point2 = new Point(3, 4);
    const result = point1.add(point2);
    expect(result.x).toBe(2);
    expect(result.y).toBe(2);
  });
  test("subtract positives", () => {
    const point1 = new Point(1, 2);
    const point2 = new Point(3, 4);
    const result = point1.subtract(point2);
    expect(result.x).toBe(-2);
    expect(result.y).toBe(-2);
  });
  test("subtract negatives", () => {
    const point1 = new Point(-1, -2);
    const point2 = new Point(-3, -4);
    const result = point1.subtract(point2);
    expect(result.x).toBe(2);
    expect(result.y).toBe(2);
  });
  test("subtract positives and negatives", () => {
    const point1 = new Point(-1, -2);
    const point2 = new Point(3, 4);
    const result = point1.subtract(point2);
    expect(result.x).toBe(-4);
    expect(result.y).toBe(-6);
  });
  test("multiply positive", () => {
    const point = new Point(1, 2);
    const result = point.multiply(2);
    expect(result.x).toBe(2);
    expect(result.y).toBe(4);
  });
  test("multiply negative", () => {
    const point = new Point(1, 2);
    const result = point.multiply(-2);
    expect(result.x).toBe(-2);
    expect(result.y).toBe(-4);
  });
  test("multiply zero", () => {
    const point = new Point(1, 2);
    const result = point.multiply(0);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
  test("divide positive", () => {
    const point = new Point(1, 2);
    const result = point.divide(2);
    expect(result.x).toBe(0.5);
    expect(result.y).toBe(1);
  });
  test("divide negative", () => {
    const point = new Point(1, 2);
    const result = point.divide(-2);
    expect(result.x).toBe(-0.5);
    expect(result.y).toBe(-1);
  });
  test("divide zero", () => {
    const point = new Point(1, 2);
    const divideByZero = () => point.divide(0);
    expect(divideByZero).toThrow(Error);
  });
  test("length zero", () => {
    const point = new Point(0, 0);
    expect(point.length()).toBe(0);
  });
  test("length 0, 1", () => {
    const point = new Point(0, 1);
    expect(point.length()).toBe(1);
  });
  test("length 1, 1", () => {
    const point = new Point(1, 1);
    expect(point.length()).toBe(1.4142135623730951);
  });
  test("orth zero", () => {
    const point = new Point(0, 0);
    const orth = point.orth();
    expect(orth.x).toBe(-0);
    expect(orth.y).toBe(0);
  });
  test("orth 0, 1", () => {
    const point = new Point(0, 1);
    const orth = point.orth();
    expect(orth.x).toBe(-1);
    expect(orth.y).toBe(0);
  });
  test("orth 1, 1", () => {
    const point = new Point(1, 1);
    const orth = point.orth();
    expect(orth.x).toBe(-1);
    expect(orth.y).toBe(1);
  });
});

describe("Vector", () => {
  test("constructor", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 1);
    const vector = new Vector(p1, p2);
    expect(vector.p1).toBe(p1);
    expect(vector.p2).toBe(p2);
  });
  test("length positive", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const vector = new Vector(p1, p2);
    expect(vector.length()).toBe(1);
  });
  test("length negative", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(-1, 0);
    const vector = new Vector(p1, p2);
    expect(vector.length()).toBe(1);
  });
  test("direction zero", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(0, 0);
    const vector = new Vector(p1, p2);
    const divideByZero = () => vector.direction();
    expect(divideByZero).toThrow(Error);
  });
  test("direction east one", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const vector = new Vector(p1, p2);
    expect(vector.direction()).toStrictEqual(new Point(1, 0));
  });
  test("direction east two", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(2, 0);
    const vector = new Vector(p1, p2);
    expect(vector.direction()).toStrictEqual(new Point(1, 0));
  });
  test("direction north", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(0, 1);
    const vector = new Vector(p1, p2);
    expect(vector.direction()).toStrictEqual(new Point(0, 1));
  });
  test("direction north east two", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(2, 2);
    const vector = new Vector(p1, p2);
    expect(vector.direction()).toStrictEqual(
      new Point(0.7071067811865475, 0.7071067811865475)
    );
  });
  test("orth zero", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(0, 0);
    const vector = new Vector(p1, p2);
    const divideByZero = () => vector.orth();
    expect(divideByZero).toThrow(Error);
  });
  test("orth east one", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const vector = new Vector(p1, p2);
    expect(vector.orth()).toStrictEqual(new Point(-0, 1));
  });
  test("orth east two", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(2, 0);
    const vector = new Vector(p1, p2);
    expect(vector.orth()).toStrictEqual(new Point(-0, 1));
  });
  test("orth north", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(0, 1);
    const vector = new Vector(p1, p2);
    expect(vector.orth()).toStrictEqual(new Point(-1, 0));
  });
  test("orth north east two", () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(2, 2);
    const vector = new Vector(p1, p2);
    expect(vector.orth()).toStrictEqual(
      new Point(-0.7071067811865475, 0.7071067811865475)
    );
  });
});

describe("DippyMap", () => {
  let divEl: HTMLDivElement;
  let svgEl: HTMLElement;
  let supplyCenterPathEl: HTMLElement;
  let provincePathEl: HTMLElement;
  let provincesLayer: HTMLElement;

  beforeEach(() => {
    divEl = document.createElement("div");
    svgEl = document.createElement("svg");
    provincePathEl = document.createElement("path");
    supplyCenterPathEl = document.createElement("path");
    provincePathEl.setAttribute("id", "lon");
    supplyCenterPathEl.setAttribute("id", "lonCenter");
    supplyCenterPathEl.setAttribute(
      "d",
      "m 700.000,710.000 c 4.8888,-2.528 2.5896,-9.3976 -3.1453 z"
    );
    provincesLayer = document.createElement("g");
    provincesLayer.setAttribute("id", "provinces");
    provincesLayer.appendChild(provincePathEl);
    svgEl.appendChild(provincesLayer);
    svgEl.appendChild(supplyCenterPathEl);
    divEl.appendChild(svgEl);
  });

  test("constructor", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    expect(dippyMap.svgEl).toStrictEqual(svgEl);
    expect(dippyMap.container).toStrictEqual(container);
  });

  test("constructor no svg element", () => {
    divEl.removeChild(svgEl);
    const container = $(divEl);
    const errorFunc = () => new DippyMap(container);
    expect(errorFunc).toThrow(Error);
  });

  test("centerOf", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);

    const point = dippyMap.centerOf("lon");
    expect(point.x).toBe(700);
    expect(point.y).toBe(710);
  });

  test("showProvinces", () => {
    provincesLayer.setAttribute("style", "display: none;");
    svgEl.appendChild(provincesLayer);
    const container = $(divEl);
    const dippyMap = new DippyMap(container);

    const computedStylesBefore = window.getComputedStyle(provincesLayer);
    dippyMap.showProvinces();
    const computedStylesAfter = window.getComputedStyle(provincesLayer);

    expect(computedStylesBefore.getPropertyValue("display")).toBe("none");
    expect(computedStylesAfter.getPropertyValue("display")).toBe("");
  });

  test("colorSC", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    const color = "#000000";

    const computedStylesBefore = window.getComputedStyle(supplyCenterPathEl);
    dippyMap.colorSC("lon", color);
    const computedStylesAfter = window.getComputedStyle(supplyCenterPathEl);

    expect(computedStylesBefore.getPropertyValue("stroke")).toBe("");
    expect(computedStylesAfter.getPropertyValue("stroke")).toBe(color);
  });

  test("colorProvince removes style", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    const color = "#000000";

    provincePathEl.setAttribute("style", "display: none");
    const computedStylesBefore = window.getComputedStyle(provincePathEl);
    dippyMap.colorProvince("lon", color);
    const computedStylesAfter = window.getComputedStyle(provincePathEl);

    expect(computedStylesBefore.getPropertyValue("display")).toBe("none");
    expect(computedStylesAfter.getPropertyValue("display")).toBe("");
  });

  test("colorProvince sets fill", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    const color = "#000000";

    const fillBefore = provincePathEl.getAttribute("fill");
    dippyMap.colorProvince("lon", color);
    const fillAfter = provincePathEl.getAttribute("fill");

    expect(fillBefore).toBe(null);
    expect(fillAfter).toBe(color);
  });

  test("colorProvince sets fill-opactiy", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    const color = "#000000";

    const fillOpacityBefore = provincePathEl.getAttribute("fill-opacity");
    dippyMap.colorProvince("lon", color);
    const fillOpacityAfter = provincePathEl.getAttribute("fill-opacity");

    expect(fillOpacityBefore).toBe(null);
    expect(fillOpacityAfter).toBe("0.8");
  });

  test("hideProvince removes style", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);

    provincePathEl.setAttribute("style", "display: none");
    const computedStylesBefore = window.getComputedStyle(provincePathEl);
    dippyMap.hideProvince("lon");
    const computedStylesAfter = window.getComputedStyle(provincePathEl);

    expect(computedStylesBefore.getPropertyValue("display")).toBe("none");
    expect(computedStylesAfter.getPropertyValue("display")).toBe("");
  });

  test("hideProvince sets fill", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    const color = "#ffffff";

    provincePathEl.setAttribute("style", "display: none");
    const fillBefore = provincePathEl.getAttribute("fill");
    dippyMap.hideProvince("lon");
    const fillAfter = provincePathEl.getAttribute("fill");

    expect(fillBefore).toBe(null);
    expect(fillAfter).toBe(color);
  });

  test("hideProvince sets fill-opacity", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);

    const fillOpacityBefore = provincePathEl.getAttribute("fill-opacity");
    dippyMap.hideProvince("lon");
    const fillOpacityAfter = provincePathEl.getAttribute("fill-opacity");

    expect(fillOpacityBefore).toBe(null);
    expect(fillOpacityAfter).toBe("0");
  });

  test("highlightProvince creates new path element", () => {
    const container = $(divEl);
    const highlightsLayer = document.createElement("g");
    highlightsLayer.setAttribute("id", "highlights");
    svgEl.setAttribute("transform", "some-transform");
    svgEl.appendChild(highlightsLayer);
    const dippyMap = new DippyMap(container);

    const elementBefore = container.find("#lon_highlight");
    dippyMap.highlightProvince("lon");
    const elementAfter = container.find("#lon_highlight");

    expect(elementBefore.length).toBe(0);
    expect(elementAfter.length).toBe(1);

    const element = elementAfter[0];
    expect(element.getAttribute("id")).toBe("lon_highlight");
    expect(element.getAttribute("style")).toBe("fill:url(#stripes)");
    expect(element.getAttribute("fill-opacity")).toBe("1");
    expect(element.getAttribute("stroke")).toBe("none");
    expect(element.getAttribute("transform")).toBe("some-transform");
  });

  test("unhighlightProvince removes element", () => {
    const container = $(divEl);
    const highlightsLayer = document.createElement("g");
    highlightsLayer.setAttribute("id", "highlights");
    svgEl.appendChild(highlightsLayer);
    const dippyMap = new DippyMap(container);

    dippyMap.highlightProvince("lon");
    const elementBefore = container.find("#lon_highlight");
    dippyMap.unhighlightProvince("lon");
    const elementAfter = container.find("#lon_highlight");

    expect(elementBefore.length).toBe(1);
    expect(elementAfter.length).toBe(0);
  });

  test("clearClickListers none", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    dippyMap.clearClickListeners();
  });

  test("clearClickListers one", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    const clickListenerRemover = jest.fn();
    dippyMap.clickListenerRemovers.push(clickListenerRemover);
    dippyMap.clearClickListeners();
    expect(clickListenerRemover).toBeCalled();
  });

  test("clearClickListers multiple", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    const clickListenerRemover1 = jest.fn();
    const clickListenerRemover2 = jest.fn();
    dippyMap.clickListenerRemovers.push(clickListenerRemover1);
    dippyMap.clickListenerRemovers.push(clickListenerRemover2);
    dippyMap.clearClickListeners();
    expect(clickListenerRemover1).toBeCalled();
    expect(clickListenerRemover2).toBeCalled();
  });

  test("addClickListener no highlight", () => {
    const container = $(divEl);
    const dippyMap = new DippyMap(container);
    const listener = jest.fn();

    const elementBefore = container.find("#lon_click");
    const highlightElementBefore = container.find("#lon_highlight");
    dippyMap.addClickListener("lon", listener, { noHighlight: true });
    const elementAfter = container.find("#lon_click");
    const highlightElementAfter = container.find("#lon_highlight");

    expect(elementBefore.length).toBe(0);
    expect(elementAfter.length).toBe(1);
    expect(highlightElementBefore.length).toBe(0);
    expect(highlightElementAfter.length).toBe(0);

    const element = elementAfter[0];
    expect(element.getAttribute("id")).toBe("lon_click");
    expect(element.getAttribute("style")).toBe(
      "fill:#000000;fill-opacity:0;stroke:none;"
    );
    expect(element.getAttribute("stroke")).toBe("none");
  });

  test("addClickListener with highlight", () => {
    const container = $(divEl);
    const highlightsLayer = document.createElement("g");
    highlightsLayer.setAttribute("id", "highlights");
    svgEl.appendChild(highlightsLayer);
    const dippyMap = new DippyMap(container);
    const listener = jest.fn();

    const elementBefore = container.find("#lon_click");
    const highlightElementBefore = container.find("#lon_highlight");
    dippyMap.addClickListener("lon", listener, {});
    const elementAfter = container.find("#lon_click");
    const highlightElementAfter = container.find("#lon_highlight");

    expect(elementBefore.length).toBe(0);
    expect(elementAfter.length).toBe(1);
    expect(highlightElementBefore.length).toBe(0);
    expect(highlightElementAfter.length).toBe(1);

    const element = elementAfter[0];
    expect(element.getAttribute("id")).toBe("lon_click");
    expect(element.getAttribute("style")).toBe(
      "fill:#000000;fill-opacity:0;stroke:none;"
    );
    expect(element.getAttribute("stroke")).toBe("none");
  });

  test("removeOrders", () => {
    const container = $(divEl);
    const ordersLayer = document.createElement("g");
    ordersLayer.setAttribute("id", "orders");
    const order = document.createElement("path");
    order.setAttribute("id", "lon_order")
    ordersLayer.appendChild(order);
    svgEl.appendChild(ordersLayer);
    const dippyMap = new DippyMap(container);

    const orderBefore = container.find("#lon_order");
    dippyMap.removeOrders();
    const orderAfter = container.find("#lon_order");

    expect(orderBefore.length).toBe(1);
    expect(orderAfter.length).toBe(0);
  });

  test("removeUnits", () => {
    const container = $(divEl);
    const unitsLayer = document.createElement("g");
    unitsLayer.setAttribute("id", "units");
    const unit = document.createElement("path");
    unit.setAttribute("id", "lon_unit")
    unitsLayer.appendChild(unit);
    svgEl.appendChild(unitsLayer);
    const dippyMap = new DippyMap(container);

    const unitBefore = container.find("#lon_unit");
    dippyMap.removeUnits();
    const unitAfter = container.find("#lon_unit");

    expect(unitBefore.length).toBe(1);
    expect(unitAfter.length).toBe(0);
  });

  test("removeUnits other layer", () => {
    const container = $(divEl);
    const unitsLayer = document.createElement("g");
    unitsLayer.setAttribute("id", "builds");
    const unit = document.createElement("path");
    unit.setAttribute("id", "lon_unit")
    unitsLayer.appendChild(unit);
    svgEl.appendChild(unitsLayer);
    const dippyMap = new DippyMap(container);

    const unitBefore = container.find("#lon_unit");
    dippyMap.removeUnits("#builds");
    const unitAfter = container.find("#lon_unit");

    expect(unitBefore.length).toBe(1);
    expect(unitAfter.length).toBe(0);
  });
});
