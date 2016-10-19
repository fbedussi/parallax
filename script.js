var Parallax = {
	_getMeasures: function() {
		return this._el.getBoundingClientRect();
	},

	_adjustInitialOffset: function() {
		var maxScroll = document.body.clientHeight - this._el.offsetTop - this._initialOffset;
		if (maxScroll < window.innerHeight) {
			console.log('initial offset ', this._initialOffset);
			this._initialOffset = Math.max(0, this._initialOffset * maxScroll / window.innerHeight);
			console.log('new initial offset ', this._initialOffset);
		}
	},

	_translate: function(y) {
		this._el.style.transform = `translateY(${y}px)`;
	},

	_setupListeners: function() {
		window.addEventListener('scroll', () => {
			var elCoord = this._getMeasures();
			if (elCoord.top > -this._initialOffset && elCoord.top <= window.innerHeight) {
				if (!this._initialTop) {
					console.log('initial top set');
					this._initialTop = elCoord.top;
				}
				this._translate(Math.max(0, elCoord.top * (this._initialOffset / this._initialTop / this._rate)));
			}
		});
	},

	init: function(customOptions) {
		var defaultOptions = {
			initialOffset: 200,
			rate: 1
		};

		var options = Object.assign({}, defaultOptions, customOptions);

		if (!(options.selector || options.el)) {
			throw new Error('Parallax needs a CSS selector or an HTML element!');
		}

		Object.keys(options).forEach((key) => {
			this['_' + key] = options[key];
		});

		if (!this._el) {
			this._el = document.querySelector(this._selector);
		}

		if (!this._el) {
			throw new Error('Parallax did\'t find any element!');
		}

		this._adjustInitialOffset();

		this._translate(this._initialOffset);

		this._setupListeners();

		return this;
	}
};

[].forEach.call(document.querySelectorAll('.parallax'), function(imgEl) {
	Object.create(Parallax).init({
		el: imgEl,
		initialOffset: 200 + Math.random() * 50,
		//rate: 1 + Math.random() * Math.random()
	});
});