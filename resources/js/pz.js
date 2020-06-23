const matrixReg = /matrix3d\((.*)\)/;

export default class PZ {
	constructor(opts = {}) {
		this.opts = opts;
		this.el = opts.el;
		this.viewPort = opts.viewPort;
		this.viewPort.addEventListener("dblclick", dblClickEvent => {
			dblClickEvent.preventDefault();
			const mat = this.getMatrix();
			mat.scaleX *= 1.5;
			mat.scaleY *= 1.5;
			this.setMatrix(mat);
		});
		this.zoomEndTimeout = null;
		this.viewPort.addEventListener("wheel", wheelEvent => {
			wheelEvent.preventDefault();
			const mat = this.getMatrix();
			const scale = 1 + wheelEvent.deltaY * -0.01;
			mat.scaleX *= scale;
			mat.scaleY *= scale;
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
			this.setMatrix(mat);
		});
		this.viewPort.addEventListener("mousedown", mouseDownEvent => {
			mouseDownEvent.preventDefault();
			let lastEvent = mouseDownEvent;
			const listeners = {};
			listeners["mousemove"] = mouseMoveEvent => {
				mouseMoveEvent.preventDefault();
				const mat = this.getMatrix();
				mat.transX += mouseMoveEvent.clientX - lastEvent.clientX;
				mat.transY += mouseMoveEvent.clientY - lastEvent.clientY;
				lastEvent = mouseMoveEvent;
				this.setMatrix(mat);
			};
			listeners["mouseup"] = mouseUpEvent => {
				mouseUpEvent.preventDefault();
				for (const eventName in listeners) {
					this.viewPort.removeEventListener(
						eventName,
						listeners[eventName]
					);
				}
			};
			listeners["mouseleave"] = mouseLeaveEvent => {
				mouseLeaveEvent.preventDefault();
				const buttons = mouseLeaveEvent.buttons;
				listeners["mouseenter"] = mouseEnterEvent => {
					mouseEnterEvent.preventDefault();
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
		this.viewPort.addEventListener("touchstart", touchStartEvent => {
			touchStartEvent.preventDefault();
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
				const mat = this.getMatrix();
				mat.transX += movement[0];
				mat.transY += movement[1];
				if (touchMoveEvent.touches.length > 1) {
					if (!calledOnZoomStart && opts.onZoomStart) {
						opts.onZoomStart();
						calledOnZoomStart = true;
					}
					const ratio = this.distanceChangeRatio(
						touchMoveEvent.touches
					);
					mat.scaleX *= ratio;
					mat.scaleY *= ratio;
				}
				this.setMatrix(mat);
				for (let i = 0; i < touchMoveEvent.changedTouches.length; i++) {
					this.touches[touchMoveEvent.changedTouches[i].identifier] =
						touchMoveEvent.changedTouches[i];
				}
			};
			const touchEndListener = touchEndEvent => {
				touchEndEvent.preventDefault();
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
	getMatrix() {
		const matrixString =
			this.el.style.transform ||
			"matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
		const match = matrixReg.exec(matrixString);
		const parts = match[1].split(",").map(part => {
			return Number.parseFloat(part);
		});
		return {
			scaleX: parts[0],
			scaleY: parts[5],
			transX: parts[12],
			transY: parts[13]
		};
	}
	setMatrix(mat) {
		if (this.opts.minScale && this.opts.minScale > mat.scaleX) {
			mat.scaleX = this.opts.minScale;
		}
		if (this.opts.minScale && this.opts.minScale > mat.scaleY) {
			mat.scaleY = this.opts.minScale;
		}
		if (this.opts.maxScale && this.opts.maxScale < mat.scaleX) {
			mat.scaleX = this.opts.maxScale;
		}
		if (this.opts.maxScale && this.opts.maxScale < mat.scaleY) {
			mat.scaleY = this.opts.maxScale;
		}
		if (
			this.opts.maxTrans &&
			mat.transX > this.opts.maxTrans * this.el.clientWidth * mat.scaleX
		) {
			mat.transX = this.opts.maxTrans * this.el.clientWidth * mat.scaleX;
		}
		if (
			this.opts.maxTrans &&
			mat.transX < -this.opts.maxTrans * this.el.clientWidth * mat.scaleX
		) {
			mat.transX = -this.opts.maxTrans * this.el.clientWidth * mat.scaleX;
		}
		if (
			this.opts.maxTrans &&
			mat.transY > this.opts.maxTrans * this.el.clientHeight * mat.scaleY
		) {
			mat.transY = this.opts.maxTrans * this.el.clientHeight * mat.scaleY;
		}
		if (
			this.opts.maxTrans &&
			mat.transY < -this.opts.maxTrans * this.el.clientHeight * mat.scaleY
		) {
			mat.transY =
				-this.opts.maxTrans * this.el.clientHeight * mat.scaleY;
		}
		this.el.style.transform =
			"matrix3d(" +
			mat.scaleX +
			",0,0,0,0," +
			mat.scaleY +
			",0,0,0,0,1,0," +
			mat.transX +
			"," +
			mat.transY +
			",0,1)";
	}
}
