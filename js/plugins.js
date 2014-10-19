window.ns = window.ns || {};

(function(app) {
	var animationApi = {
		defaults: {
			"spriteWidth": 640,
			"spriteHeight": 64,
			"canvasWidth": 500,
			"canvasHeight": 500
		},
		init: function(options) {
			this.options = options || {};
			app.helper.shallowCopy(this.options, this.defaults);
		},
		_state: {
			animationStarted: false,
			animationsStarted: false
		},
		_getCanvas: function() {
			if (!this.canvas) {
				this.canvas = document.getElementById(this.options.elementId);
				this.canvas.width = this.options.canvasWidth;
				this.canvas.height = this.options.canvasHeight;
			}

			return this.canvas;
		},
		_getCharacterObject: function(options) {
			var character = Object.create(app.Character, {
				"context": {
					value: this._getCanvas().getContext("2d")
				},
				"spriteWidth": {
					value: this.options.spriteWidth
				},
				"spriteHeight": {
					value: this.options.spriteHeight
				},
				"canvasWidth": {
					value: this.options.canvasWidth
				},
				"canvasHeight": {
					value: this.options.canvasHeight
				},
				"image": {
					value: app.helper.createImage(this.options.imgSrc)
				}
			});

			character.init(options);

			return character;
		},
		_getCharactersContainer: function() {
			var characterContainer = Object.create(app.Characters, {
				"context": {
					value: this._getCanvas().getContext("2d")
				},
				"canvasWidth": {
					value: this.options.canvasWidth
				},
				"canvasHeight": {
					value: this.options.canvasHeight
				}
			});
			characterContainer.init();

			return characterContainer;
		},
		_stopAnimations: function() {
			if (this._state.animationStarted) {
				this.character.stop();
				this.character = null;
				this._state.animationStarted = false;
			} else if (this._state.animationsStarted) {
				this.characters.stopAll();
				this.characters = null;
				this._state.animationsStarted = false;
			}

			clearTimeout(this.animationTimeout);
			this._clearCanvas();
		},
		_clearCanvas: function() {
			this._getCanvas().getContext("2d").clearRect(0, 0, this.options.canvasWidth, this.options.canvasHeight);
		},
		startMultipleAnimations: function() {
			var that = this,
				numIndex = new app.helper.NumIndex(0, this.options.animationTimePosition.length - 1, false),
				speedIndex = new app.helper.NumIndex(1, 4, true),
				data = this.options.animationTimePosition;

			this._stopAnimations();
			this.characters = this._getCharactersContainer();

			function draw(character, timeDelay) {
				that.animationTimeout = setTimeout(function() {
					that.characters.add(character);

					if (numIndex.hasNext()) {
						numIndex.inc();
						speedIndex.inc();
						draw(that._getCharacterObject({
								"position": data[numIndex.current()].position,
								"speed": speedIndex.current()
							}),
							data[numIndex.current()].time - data[numIndex.previous()].time);
					}
				}, timeDelay);
			}

			if (numIndex.hasNext()) {
				numIndex.inc();
				speedIndex.inc();
				this._state.animationsStarted = true;
				that.characters.animateAll({
					"speed": 1
				});
				draw(this._getCharacterObject({
						"position": data[numIndex.current()].position,
						"speed": speedIndex.current()
					}),
					data[numIndex.current()].time - data[numIndex.previous()].time);
			}
		},
		startSingleAnimation: function() {
			var that = this,
				numIndex = new app.helper.NumIndex(0, this.options.animationTimePosition.length - 1, false),
				data = this.options.animationTimePosition;

			this._stopAnimations();

			numIndex.inc();
			this.character = this._getCharacterObject({
				"position": data[numIndex.current()].position,
				"speed": 3
			});

			function draw(character, timeDelay) {
				that.animationTimeout = setTimeout(function() {
					if (!that._state.animationStarted) {
						that._state.animationStarted = true;
						character.animate({
							"speed": 2
						});
					}

					if (numIndex.hasNext()) {
						character.moveTo(data[numIndex.current()].position);
						numIndex.inc();
						draw(character,
							data[numIndex.current()].time - data[numIndex.previous()].time);
					}
				}, timeDelay);
			}

			if (numIndex.hasNext()) {
				draw(this.character,
					data[numIndex.current()].time - data[numIndex.previous()].time);
			}
		}
	}

	function AnimationApi() {
		if (arguments.callee._singletonInstance) {
			return arguments.callee._singletonInstance;
		}
		arguments.callee._singletonInstance = this;

		this.instance = Object.create(animationApi);
	}

	app.animationApi = {
		getInstance: function() {
			var obj = new AnimationApi();
			return obj.instance;
		}
	}
})(ns);