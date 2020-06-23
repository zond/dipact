const matrixReg = /matrix3d\((.*)\)/;

class Transform {
	constructor(opts = {}) {
		this.opts = opts;
		this.el = opts.el;
		this.viewPort = opts.viewPort;
		const originString =
			this.el.style.transformOrigin ||
			this.el.clientWidth / 2 +
				"px " +
				this.el.clientHeight / 2 +
				"px 0px";
		const originParts = originString.split(" ").map(part => {
			return Number.parseFloat(part);
		});
		const matrixString =
			this.el.style.transform ||
			"matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
		const match = matrixReg.exec(matrixString);
		const matrixParts = match[1].split(",").map(part => {
			return Number.parseFloat(part);
		});
		this.scaleX = matrixParts[0];
		this.scaleY = matrixParts[5];
		this.transX = matrixParts[12];
		this.transY = matrixParts[13];
		this._origX = originParts[0];
		this._origY = originParts[1];
	}
	apply() {
		if (this.opts.minScale && this.opts.minScale > this.scaleX) {
			this.scaleX = this.opts.minScale;
		}
		if (this.opts.minScale && this.opts.minScale > this.scaleY) {
			this.scaleY = this.opts.minScale;
		}
		if (this.opts.maxScale && this.opts.maxScale < this.scaleX) {
			this.scaleX = this.opts.maxScale;
		}
		if (this.opts.maxScale && this.opts.maxScale < this.scaleY) {
			this.scaleY = this.opts.maxScale;
		}
		if (this.opts.maxTrans) {
			const rect = this.el.getBoundingClientRect();
			const viewPortRect = this.viewPort.getBoundingClientRect();
			const elLeftEdge = rect.x - viewPortRect.x;
			const maxHorizTrans = viewPortRect.width * this.opts.maxTrans;
			const tooMuchTransRight = elLeftEdge - maxHorizTrans;
			if (tooMuchTransRight > 0) {
				this.transX -= tooMuchTransRight;
			}
			const elRightEdge = rect.x - viewPortRect.x + rect.width;
			const tooMuchTransLeft =
				viewPortRect.width - maxHorizTrans - elRightEdge;
			if (tooMuchTransLeft > 0) {
				this.transX += tooMuchTransLeft;
			}
			const elTopEdge = rect.y - viewPortRect.y;
			const maxVertTrans = viewPortRect.height * this.opts.maxTrans;
			const tooMuchTransDown = elTopEdge - maxVertTrans;
			if (tooMuchTransDown > 0) {
				this.transY -= tooMuchTransDown;
			}
			const elBottomEdge = rect.y - viewPortRect.y + rect.height;
			const tooMuchTransUp =
				viewPortRect.height - maxVertTrans - elBottomEdge;
			if (tooMuchTransUp > 0) {
				this.transY += tooMuchTransUp;
			}
		}
		this.el.style.transformOrigin =
			"" + this._origX + "px " + this._origY + "px 0px";
		this.el.style.transform =
			"matrix3d(" +
			this.scaleX +
			",0,0,0,0," +
			this.scaleY +
			",0,0,0,0,1,0," +
			this.transX +
			"," +
			this.transY +
			",0,1)";
	}
	get origX() {
		return this._origX;
	}
	get origY() {
		return this._origY;
	}
	set origX(newOrigX) {
		const delta = (this._origX - newOrigX) * (this.scaleX - 1);
		this.transX -= delta;
		this._origX = newOrigX;
	}
	set origY(newOrigY) {
		const delta = (this._origY - newOrigY) * (this.scaleY - 1);
		this.transY -= delta;
		this._origY = newOrigY;
	}
}

export default class PZ {
	constructor(opts = {}) {
		this.opts = opts;
		this.el = opts.el;
		this.viewPort = opts.viewPort;
		this.viewPort.addEventListener("dblclick", dblClickEvent => {
			const trans = new Transform(this.opts);
			const rect = this.el.getBoundingClientRect();
			trans.origX = (dblClickEvent.clientX - rect.left) / trans.scaleX;
			trans.origY = (dblClickEvent.clientY - rect.top) / trans.scaleY;
			trans.scaleX *= 1.5;
			trans.scaleY *= 1.5;
			trans.apply();
		});
		this.zoomEndTimeout = null;
		this.viewPort.addEventListener("wheel", wheelEvent => {
			wheelEvent.preventDefault();
			const trans = new Transform(this.opts);
			const rect = this.el.getBoundingClientRect();
			trans.origX = (wheelEvent.clientX - rect.left) / trans.scaleX;
			trans.origY = (wheelEvent.clientY - rect.top) / trans.scaleY;
			const scale = 1 + wheelEvent.deltaY * -0.01;
			trans.scaleX *= scale;
			trans.scaleY *= scale;
			if (this.zoomEndTimeout) {
				clearTimeout(this.zoomEndTimeout);
			} else {
				if (opts.onZoomStart) {
					opts.onZoomStart();
				}
			}
			this.zoomEndTimeout = setTimeout(_ => {
				if (opts.onZoomEnd) {
					opts.onZoomEnd();
				}
				this.zoomEndTimeout = null;
			}, 300);
			trans.apply();
		});
		this.viewPort.addEventListener("mousedown", mouseDownEvent => {
			let lastEvent = mouseDownEvent;
			const listeners = {};
			listeners["mousemove"] = mouseMoveEvent => {
				const trans = new Transform(this.opts);
				trans.transX += mouseMoveEvent.clientX - lastEvent.clientX;
				trans.transY += mouseMoveEvent.clientY - lastEvent.clientY;
				lastEvent = mouseMoveEvent;
				trans.apply();
			};
			listeners["mouseup"] = mouseUpEvent => {
				for (const eventName in listeners) {
					this.viewPort.removeEventListener(
						eventName,
						listeners[eventName]
					);
				}
			};
			listeners["mouseleave"] = mouseLeaveEvent => {
				const buttons = mouseLeaveEvent.buttons;
				listeners["mouseenter"] = mouseEnterEvent => {
					if (mouseEnterEvent.buttons != buttons) {
						listeners["mouseup"](mouseEnterEvent);
					}
					this.viewPort.removeEventListener(
						"mouseenter",
						listeners["mouseenter"]
					);
					delete listeners["mouseenter"];
				};
				this.viewPort.addEventListener(
					"mouseenter",
					listeners["mouseenter"]
				);
			};
			for (const eventName in listeners) {
				this.viewPort.addEventListener(eventName, listeners[eventName]);
			}
		});
		this.touches = {};
		this.touching = false;
		this.lastSingleTouchStartAt = null;
		this.viewPort.addEventListener("touchstart", touchStartEvent => {
			if (touchStartEvent.touches.length == 1) {
				if (
					this.lastSingleTouchStartAt &&
					new Date().getTime() - this.lastSingleTouchStartAt < 300
				) {
					this.lastSingleTouchStartAt = null;
					const trans = new Transform(this.opts);
					const rect = this.el.getBoundingClientRect();
					trans.origX =
						(touchStartEvent.touches[0].clientX - rect.left) /
						trans.scaleX;
					trans.origY =
						(touchStartEvent.touches[0].clientY - rect.top) /
						trans.scaleY;
					trans.scaleX *= 1.5;
					trans.scaleY *= 1.5;
					trans.apply();
					return;
				} else {
					this.lastSingleTouchStartAt = new Date().getTime();
				}
			}
			for (let i = 0; i < touchStartEvent.changedTouches.length; i++) {
				this.touches[touchStartEvent.changedTouches[i].identifier] =
					touchStartEvent.changedTouches[i];
			}
			if (this.touching) {
				return;
			}
			let calledOnZoomStart = false;
			this.touching = true;
			const touchMoveListener = touchMoveEvent => {
				touchMoveEvent.preventDefault();
				const movement = this.averageMovement(
					touchMoveEvent.changedTouches
				);
				const trans = new Transform(this.opts);
				const rect = this.el.getBoundingClientRect();
				const pos = this.averagePos(touchMoveEvent.touches);
				trans.origX = (pos[0] - rect.left) / trans.scaleX;
				trans.origY = (pos[1] - rect.top) / trans.scaleY;
				trans.transX += movement[0];
				trans.transY += movement[1];
				if (touchMoveEvent.touches.length > 1) {
					if (!calledOnZoomStart && opts.onZoomStart) {
						opts.onZoomStart();
						calledOnZoomStart = true;
					}
					const ratio = this.distanceChangeRatio(
						touchMoveEvent.touches
					);
					trans.scaleX *= ratio;
					trans.scaleY *= ratio;
				}
				trans.apply();
				for (let i = 0; i < touchMoveEvent.changedTouches.length; i++) {
					this.touches[touchMoveEvent.changedTouches[i].identifier] =
						touchMoveEvent.changedTouches[i];
				}
			};
			const touchEndListener = touchEndEvent => {
				for (let i = 0; i < touchEndEvent.changedTouches.length; i++) {
					delete this.touches[
						touchEndEvent.changedTouches[i].identifier
					];
				}
				if (Object.keys(this.touches).length == 0) {
					if (calledOnZoomStart && opts.onZoomEnd) {
						opts.onZoomEnd();
					}
					this.touching = false;
					this.viewPort.removeEventListener(
						"touchmove",
						touchMoveListener
					);
					this.viewPort.removeEventListener(
						"touchend",
						touchEndListener
					);
				}
			};
			this.viewPort.addEventListener("touchmove", touchMoveListener);
			this.viewPort.addEventListener("touchend", touchEndListener);
		});
	}
	distanceChangeRatio(touchList) {
		const oldTouches = [];
		const newTouches = [];
		for (let i = 0; i < touchList.length; i++) {
			const oldTouch = this.touches[touchList[i].identifier];
			if (oldTouch) {
				oldTouches.push(oldTouch);
				newTouches.push(touchList[i]);
			}
		}
		const oldDist = this.maxDist(oldTouches);
		const newDist = this.maxDist(newTouches);
		return newDist / oldDist;
	}
	maxDist(touchAry) {
		let max = -1;
		for (let idx1 = 0; idx1 < touchAry.length - 1; idx1++) {
			for (let idx2 = idx1 + 1; idx2 < touchAry.length; idx2++) {
				const t1 = touchAry[idx1];
				const t2 = touchAry[idx2];
				const dist = Math.pow(
					Math.pow(t1.clientX - t2.clientX, 2) +
						Math.pow(t1.clientY - t2.clientY, 2),
					0.5
				);
				if (dist > max) {
					max = dist;
				}
			}
		}
		return max;
	}
	averagePos(touchList) {
		const sum = [0.0, 0.0];
		for (let i = 0; i < touchList.length; i++) {
			sum[0] += touchList[i].clientX;
			sum[1] += touchList[i].clientY;
		}
		return [sum[0] / touchList.length, sum[1] / touchList.length];
	}
	averageMovement(touchList) {
		const sum = [0.0, 0.0];
		let len = 0.0;
		for (let i = 0; i < touchList.length; i++) {
			const oldTouch = this.touches[touchList[i].identifier];
			if (oldTouch) {
				sum[0] += touchList[i].clientX - oldTouch.clientX;
				sum[1] += touchList[i].clientY - oldTouch.clientY;
				len += 1;
			}
		}
		return [sum[0] / len, sum[1] / len];
	}
}
