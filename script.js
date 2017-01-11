var Parallax = {
	_getMeasures: function() {
		return this._el.getBoundingClientRect();
	},

	_adjustInitialOffset: function() {
		//Reduce initialOffset if the element is too close to the document end
		var maxScroll = document.body.clientHeight - this._el.offsetTop - this._initialOffset - this._el.clientHeight;
		if (maxScroll < window.innerHeight) {
			this._initialOffset = Math.max(0, Math.floor(this._initialOffset * maxScroll / window.innerHeight));
		}
	},

	_applyTranslate: function(y) {
		this._el.style.transform = `translateY(${y}px)`;
	},
	
	_managePosition: function() {
		var elCoord = this._getMeasures();
		
		if (elCoord.top < 0) {
			return;
		}
		
		if (elCoord.top > window.innerHeight) {
			this._applyTranslate(this._initialOffset);
			return;
		}
		
		//if (elCoord.top >= 0 && elCoord.top <= window.innerHeight) 
		var newOffset = Math.floor(this._initialOffset * elCoord.top / (window.innerHeight - this._initialOffset));
		this._applyTranslate(Math.max(0, Math.min(this._initialOffset, newOffset)));
	},

	_setupListeners: function() {
		window.addEventListener('scroll', this._managePosition.bind(this));
	},

	init: function(customOptions) {
		var defaultOptions = {
			initialOffset: 200
		};

		var options = Object.assign({}, defaultOptions, customOptions);

		if (!(options.selector || options.el)) {
			throw new Error('Parallax needs a CSS selector or an HTML element!');
		}

		Object.keys(options).forEach((key) => {
			if (['el', 'selector', 'initialOffset'].includes(key)) {
				this['_' + key] = options[key];
			}
		});

		if (!this._el) {
			this._el = document.querySelector(this._selector);
		}

		if (!this._el) {
			throw new Error('Parallax did\'t find any element!');
		}

		this._adjustInitialOffset();
		this._managePosition();
		this._setupListeners();

		return this;
	}
};

[].forEach.call(document.querySelectorAll('.parallax'), function(imgEl) {
	Object.create(Parallax).init({
		el: imgEl,
		initialOffset: 200 + Math.random() * 50,
	});
});