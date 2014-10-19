window.ns = window.ns || {};

(function(app) {
	function isCanvasSupported() {
		if (Modernizr.canvas) {
			return true;
		}

		return false;
	}

	function shallowCopy(a, b) {
		for (var propName in b) {
			if (b.hasOwnProperty(propName) && !a[propName]) {
				a[propName] = b[propName];
			}
		}
		return a;
	}

	function createImage(imgSrc) {
		var image = new Image();
		image.src = imgSrc;

		return image;
	};

	function NumIndex(initValue, maxValue, round) {
		this.index = null;
		this.maxValue = maxValue;
		this.initValue = initValue;
		this.round = round;
	}

	NumIndex.prototype.inc = function() {
		if(this.index === null) {
			this.index = this.initValue;
		} else {
			this.index++;
			if(this.index > this.maxValue) {
				if(this.round) {
					this.index = this.initValue;
				} else {
					this.index = this.maxValue;
				}
			}
		}
	}

	NumIndex.prototype.hasNext = function() {
		return this.index < this.maxValue;
	}

	NumIndex.prototype.current = function() {
		return this.index;
	}

	NumIndex.prototype.previous = function() {
		return (this.index <= this.initValue ? this.initValue : this.index - 1);
	}

	var helper = {
		isCanvasSupported: isCanvasSupported,
		shallowCopy: shallowCopy,
		createImage: createImage,
		NumIndex: NumIndex
	}

	app.helper = helper;
})(ns);