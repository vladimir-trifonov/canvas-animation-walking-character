window.ns = window.ns || {};

(function(app) {
	if (!ns.helper.isCanvasSupported()) {
		return;
	}

	window.onload = function() {
		var animationData = app.dataService.getAnimationData();
		var animationApi = app.animationApi.getInstance();

		var btnAnimateSingle = document.getElementById("button-animate-single");
		var btnAnimateMulti = document.getElementById("button-animate-multi");

		animationApi.init({
			"elementId": "field-canvas",
			"imgSrc": "images/character-sprite.png",
			"animationTimePosition": animationData
		});

		btnAnimateSingle.addEventListener("click", function() {
			animationApi.startSingleAnimation();
		});

		btnAnimateMulti.addEventListener("click", function() {
			animationApi.startMultipleAnimations();
		});
	};
})(ns);