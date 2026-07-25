export default function initSlideToggle() {
	HTMLElement.prototype.slideToggle = function (duration = 400, callback) {
		if (this.hidden || this.clientHeight === 0) {
			this.slideDown(duration, callback);
		} else {
			this.slideUp(duration, callback);
		}
	};

	HTMLElement.prototype.slideUp = function (duration = 400, callback) {
		_slide(this, duration, callback, false);
	};

	HTMLElement.prototype.slideDown = function (duration = 400, callback) {
		_slide(this, duration, callback, true);
	};

	function _finish(el, callback) {
		el.style.removeProperty("height");
		el.style.removeProperty("padding-top");
		el.style.removeProperty("padding-bottom");
		el.style.removeProperty("margin-top");
		el.style.removeProperty("margin-bottom");
		el.style.removeProperty("overflow");
		el.style.removeProperty("transition-duration");
		el.style.removeProperty("transition-property");
		el.classList.remove("_slide");
		if (typeof callback === "function") callback();
	}

	function _slide(el, duration, callback, isDown) {
		if (el.classList.contains("_slide")) return;

		el.classList.add("_slide");

		if (isDown) {
			el.hidden = false;
			el.style.removeProperty("display");

			const height = el.offsetHeight;

			el.style.overflow = "hidden";
			el.style.height = "0";
			el.style.paddingTop = "0";
			el.style.paddingBottom = "0";
			el.style.marginTop = "0";
			el.style.marginBottom = "0";
			el.offsetHeight;

			el.style.transitionProperty = "height, margin, padding";
			el.style.transitionDuration = `${duration}ms`;
			el.style.height = `${height}px`;
			el.style.removeProperty("padding-top");
			el.style.removeProperty("padding-bottom");
			el.style.removeProperty("margin-top");
			el.style.removeProperty("margin-bottom");

			window.setTimeout(() => _finish(el, callback), duration);
		} else {
			el.style.transitionProperty = "height, margin, padding";
			el.style.transitionDuration = `${duration}ms`;
			el.style.height = `${el.offsetHeight}px`;
			el.offsetHeight;

			el.style.overflow = "hidden";
			el.style.height = "0";
			el.style.paddingTop = "0";
			el.style.paddingBottom = "0";
			el.style.marginTop = "0";
			el.style.marginBottom = "0";

			window.setTimeout(() => {
				el.hidden = true;
				_finish(el, callback);
			}, duration);
		}
	}
}
