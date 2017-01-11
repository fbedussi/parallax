var Parallax = {
	_currentOffset: null,

	_getMeasures: function() {
		return this._el.getBoundingClientRect();
	},

	/**
	 * @desc reduces initialOffset for element too close to the document end
	 * @returns {}
	 */
	_adjustInitialOffset: function() {
		var elCoord = this._getMeasures();
		var maxScroll = document.body.clientHeight - (this._scrollingElement.scrollTop + elCoord.top + elCoord.height) - this._initialOffset;
		if (maxScroll < (window.innerHeight - this._topMargin)) {
			this._initialOffset = Math.max(0, this._initialOffset * maxScroll / window.innerHeight);
			return;
		}
	},
	
	_trottle: function(fn, interval) {
		var prevTime = Date.now();
		
		return function() {
			var now = Date.now();
			if (now - prevTime > interval) {
				fn();
				prevTime = now;
			}
		};
	},

	_translate: function(y) {
		if (y === this._currentOffset) {
			return;
		}
		this._currentOffset = y;
		this._el.style.transform = `translateY(${y}px)`;
	},

	_manageOffset: function() {
		var elCoord = this._getMeasures();

		if (elCoord.top <= window.innerHeight) {
			//the offset goes from the initial value to 0 in the space from initial position and top margin
			let newOffset = Math.max(0, (this._initialOffset * (elCoord.top - this._topMargin)) / ((this._initialTop - this._topMargin) * this._speed));

			//if yoyo is enabled or the new offset is < than the old one move the element
			if (this._yoyo || newOffset < this._currentOffset) {
				this._translate(newOffset);
			}

			return;
		}

		//the element is below the viewport and is should reset
		if (!this._yoyo && this._resetAtScrollDown && this._currentOffset !== this._initialOffset) {
			this._translate(this._initialOffset);
		}
	},

	_setupListeners: function() {
		window.addEventListener('scroll', this._trottle(this._manageOffset.bind(this), this._trottleInterval));
	},

	init: function(customOptions) {
		var defaultOptions = {
			initialOffset: 50,
			randomizeInitialOffset: true,
			randomizeSpeed: true,
			transitionDuration: '0.4s',
			trottleInterval: 100,
			topMargin: 0,
			yoyo: true, //true: the element moves down when scrolling up | false: the element move only upwards
			resetAtScrollDown: true, //reset the offset to initial value when the element exits the viewport from the bottom (e.g. when scrolling up)
			speed: 1
		};

		var options = Object.assign({}, defaultOptions, customOptions);

		if (!(options.el)) {
			throw new Error('Parallax needs an HTML element!');
		}

		if (options.randomizeInitialOffset) {
			options.initialOffset += Math.random() * options.initialOffset;
		}

		if (options.randomizeSpeed) {
			options.speed += Math.random();
		}

		['el',
			'initialOffset',
			'speed',
			'transitionDuration',
			'trottleInterval',
			'topMargin',
			'resetAtScrollDown',
			'yoyo'].forEach((key) => {
			this['_' + key] = options[key];
		});

		if (!this._el) {
			throw new Error('Parallax didn\'t find any element!');
		}

		if (this._el.style.transition === '') {
			this._el.style.transition = 'transform ' + this._transitionDuration;
		}

		this._scrollingElement = document.scrollingElement || document.documentElement;

		this._adjustInitialOffset();
		this._initialTop = Math.min(window.innerHeight, this._getMeasures().top + this._initialOffset + this._scrollingElement.scrollTop);
		this._translate(this._initialOffset);

		this._setupListeners();

		return this;
	}
};

/**
 * @desc initialize the parallax effect on an element
 * @param {} options
 **/
export default function createParallax(options) {
	var parallaxObjects = [];
	var elements = [];

	if (typeof options.el === 'object' && Object.getPrototypeOf(options.el).constructor === NodeList) {
		//options.el is a NodeList collection, e.g. the result of a querySelectorAll
		elements = [].slice.call(options.el);
	} else if (typeof options.el === 'string') {
		//options.el is a string that is treated as a css selector
		elements = [].slice.call(document.querySelectorAll(options.el));
	} else if (options.el.jquery) {
		//options.el is a jquery object
		elements = options.el.toArray();
	} else if (typeof options.el === 'object' && Object.getPrototypeOf(options.el.constructor) === HTMLElement) {
		//options.el is an HTMLElement, e.g. the result of a querySelector
		elements = [options.el];
	}

	elements.forEach(el => {
		options.el = el;
		parallaxObjects.push(Object.create(Parallax).init(options));
	});

	return parallaxObjects;
}
