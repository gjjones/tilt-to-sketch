(function($) {

	$.fn.rotate = function(angle) {
		var numOf90s = Math.round(angle / 90),
			swapDimensions = numOf90s % 2 !== 0;
		// we only rotate multiples of 90
		angle = numOf90s * 90;

		this.each(function(index, element) {
			if (element.tagName.toLowerCase() !== 'canvas')
				return;

			var offset = {},
        canvas = element,
				ctx = canvas.getContext('2d'),
				tmpCanvas,
				tmpCtx;

			tmpCanvas = document.createElement('canvas');
			tmpCanvas.width = canvas.width;
			tmpCanvas.height = canvas.height;
			tmpCtx = tmpCanvas.getContext('2d');
			tmpCtx.drawImage(canvas, 0, 0);

			canvas.width = swapDimensions ? tmpCanvas.height : tmpCanvas.width;
			canvas.height = swapDimensions ? tmpCanvas.width : tmpCanvas.height;

			ctx.save();

				offset.x = canvas.width / 2;
				offset.y = canvas.height / 2;
				ctx.translate(offset.x, offset.y);
				ctx.rotate(angle * Math.PI / 180);
				if (swapDimensions) {
					offset.x ^= offset.y;
					offset.y ^= offset.x;
					offset.x ^= offset.y;
				}
				offset.x = -offset.x;
				offset.y = -offset.y;
				ctx.translate(offset.x, offset.y);

				ctx.drawImage(tmpCanvas, 0, 0);

			ctx.restore();

		});

		return this;
	};

}(jQuery));
