var Parallax = {
  _translate: function(y) {
    this._el.style.transform = `translateY(${y}px)`;
  },
  
  _setupListeners: function() {
    window.addEventListener('scroll', () => {
      var elCoord = this._el.getBoundingClientRect(); 
      if ( elCoord.top > 0 && elCoord.top < window.innerHeight) {
        this._translate(Math.max(0, this._initialOffset - (document.scrollingElement.scrollTop * this._initialOffset / (document.body.clientHeight - window.innerHeight))*this._rate));
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
      this['_'+key] = options[key];
    });

    if (!this._el) {
      this._el = document.querySelector(this._selector);  
    }
    
    if (!this._el) {
      throw new Error('Parallax did\'t find any element!');
    }
    
    this._translate(this._initialOffset);
    
    this._setupListeners();
    
    return this;
  }
};

[].forEach.call(document.querySelectorAll('.parallax'), function(imgEl) {
  Object.create(Parallax).init({
    el: imgEl,
    initialOffset: 250 + Math.random() * 50,
    rate: 1 + Math.random()
  });
});