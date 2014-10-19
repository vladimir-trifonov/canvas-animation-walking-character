window.ns = window.ns || {};

(function(app) {
	var Characters = {
		state: {
			gameStarted: false
		},
		init: function() {
			Object.defineProperty(this, 'animationStopped', {
				enumerable: true,
				configurable: false,
				writable: true,
				value: false
			});

			Object.defineProperty(this, 'objects', {
				enumerable: true,
				configurable: false,
				writable: false,
				value: []
			});
		},
		add: function(character) {
			this.objects.push(character);
		},
		animateAll: function(options) {
			if(!this.state.gameStarted) {
				options.speedIndex = new app.helper.NumIndex(1, 8, true);
				options.speedIndex.inc();

				this.state.gameStarted = true;
				this._gameLoop(options);
			}
		},
		stopAll: function() {
			this.state.gameStarted = false;
			this.animationStopped = true;
		},
		_gameLoop: function(options) {
			var that = this;
			setTimeout(function() {
				if(!that.animationStopped) {
					requestAnimationFrame(function() {
						options.speedIndex.inc();
						that._gameLoop.call(that, options);
					});
				}
			}, that._calcSpeed(options.speed));

			this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			this.objects.forEach(function(obj) {
				if(obj.imageLoaded === true && ((options.speedIndex.current() + 2) % obj.speed === 0)) {
					obj._update.call(obj);
				}
				obj._render.call(obj);
			})
		},
		_calcSpeed: function(speed) {
			return (speed || 4) * 30;
		}
	};

	app.Characters = Characters;
})(ns);