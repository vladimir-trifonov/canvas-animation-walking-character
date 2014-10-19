window.ns = window.ns || {};

(function(app) {
	var Character = {
		init: function(options) {
			var that = this,
				options = options || {},
				frameIndex = options.frameIndex || 0,
				ticksPerFrame = options.ticksPerFrame || 0,
				numberOfFrames = options.numberOfFrames || 10,
				tickCount = options.tickCount || 0;

			Object.defineProperty(this, 'frameIndex', {
				enumerable: true,
				configurable: false,
				get: function() { return frameIndex; },
  				set: function(newValue) {
  					frameIndex = newValue;
  				}
			});

			Object.defineProperty(this, 'ticksPerFrame', {
				enumerable: true,
				configurable: false,
				get: function() { return ticksPerFrame; },
  				set: function(newValue) {
  					ticksPerFrame = newValue;
  				}
			});

			Object.defineProperty(this, 'numberOfFrames', {
				enumerable: true,
				configurable: false,
				get: function() { return numberOfFrames; },
  				set: function(newValue) {
  					numberOfFrames = newValue;
  				}
			});

			Object.defineProperty(this, 'tickCount', {
				enumerable: true,
				configurable: false,
				get: function() { return tickCount; },
  				set: function(newValue) {
  					tickCount = newValue;
  				}
			});

			Object.defineProperty(this, 'animationStopped', {
				enumerable: true,
				configurable: false,
				writable: true,
				value: false
			});

			Object.defineProperty(this, 'loop', {
				enumerable: true,
				configurable: false,
				writable: false,
				value: (typeof options.loop === "undefined" ? true : options.loop)
			});

			Object.defineProperty(this, 'speed', {
				enumerable: true,
				configurable: false,
				writable: false,
				value: options.speed
			});

			Object.defineProperty(this, 'position', {
				enumerable: true,
				configurable: false,
				writable: true,
				value: options.position || [0, 0]
			});

			this.image.onload = onImageLoaded;

			function onImageLoaded() {
				that.imageLoaded = true;
			}
		},
		animate: function(options) {
			var that = this;
			if (this.imageLoaded) {
				this._objLoop(options);
			} else {
				this.image.addEventListener("load", function() {
					that._objLoop.call(that, options);
				});
			}
		},
		stop: function() {
			this.animationStopped = true;
		},
		moveTo: function(position) {
			this._clear();
			this.position = position;
		},
		_render: function() {
			this.context.drawImage(
				this.image,
				this.frameIndex * this.spriteWidth / this.numberOfFrames,
				0,
				this.spriteWidth / this.numberOfFrames,
				this.spriteHeight,
				this.position[0],
				this.position[1],
				this.spriteWidth / this.numberOfFrames,
				this.spriteHeight);
		},
		_update: function() {
			this.tickCount = this.tickCount + 1;
			if (this.tickCount > this.ticksPerFrame) {
				this.tickCount = 0;
				if (this.frameIndex < this.numberOfFrames - 1) {
					this.frameIndex += 1;
				} else if (this.loop) {
					this.frameIndex = 0;
				}
			}
		},
		_objLoop: function(options) {
			var that = this;
			setTimeout(function() {
				if(!that.animationStopped) {
					requestAnimationFrame(function() {
						that._objLoop.call(that, options);
					});
				}
			}, that._calcSpeed(options.speed));

			this._update();
			this._clear();
			this._render();
		},
		_calcSpeed: function(speed) {
			return (speed || 4) * 30;
		},
		_clear: function() {
			this.context.clearRect(this.position[0], this.position[1], this.spriteWidth / this.numberOfFrames, this.spriteHeight);
		}
	}

	app.Character = Character;
})(ns);