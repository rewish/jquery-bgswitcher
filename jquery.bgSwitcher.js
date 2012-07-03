/*!
 * jQuery.bgSwitcher
 *
 * @version    0.3.6-beta
 * @author     Hiroshi Hoaki <rewish.org@gmail.com>
 * @copyright  2010-2012 Hiroshi Hoaki
 * @license    http://rewish.org/license/mit The MIT License
 * @link       http://rewish.org/javascript/jquery_bg_switcher
 */
;(function($) {

	$.fn.bgSwitcher = function(options) {
		return this.each(function() {
			$(this).data('bgSwitcher', new $.bgSwitcher(this, options));
		});
	};

	$.bgSwitcher = function(node, options) {
		this.initialize.apply(this, arguments);
	};

	$.bgSwitcher.defaultOptions = {
		images   : null,
		interval : 5000,
		autoStart: true,
		duration : 1000,
		easing   : 'linear',
		loop     : true,
		random   : false,
		resize   : true,
		switchHandler: function() {
			this.node.fadeOut(this.options.duration, this.options.easing);
		}
	};

	$.bgSwitcher.prototype = {

		initialize: function(node, options) {
			this.node = $(node);
			this.setOptions(options);

			this.preload();

			this.index = -1;
			this.next  = this.options.random ? this.random : this.order;
			this.next();
			this.normalSwitch(this.options.images[this.index]);

			if (this.options.duration > 0) {
				this.initCloneNode();
				this.doSwitch = this.fadeSwitch;
			} else {
				this.doSwitch = this.normalSwitch;
			}

			if (this.options.autoStart) {
				this.start();
			}
		},

		setOptions: function(options) {
			this.options = $.extend(true, {}, $.bgSwitcher.defaultOptions, options);

			if (!(this.options.images instanceof Array)) {
				throw new Error('options.images is invalid.');
			}

			if (typeof this.options.images[0] === 'string'
					&& typeof this.options.images[1] === 'number'
					&& typeof this.options.images[2] === 'number') {
				this.sequence();
			}

			if (this.options.images.length <= 1) {
				throw new Error('Image must be at least more than two.');
			}

			// For backward compatibility
			if (this.options.fadeSpeed != null) {
				this.options.duration = this.options.fadeSpeed;
			}
		},

		start: function() {
			if (this.timeId) {
				return;
			}
			var self = this;
			this.timeId = setInterval(function() {
				self.next();
				self.doSwitch(self.options.images[self.index]);
			}, self.options.interval);
		},

		stop: function() {
			if (this.timeId) {
				clearInterval(this.timeId);
				this.timeId = null;
			}
		},

		toggle: function() {
			if (this.timeId) {
				this.stop();
			} else {
				this.start();
			}
		},

		reset: function() {
			this.index = 0;
			this.stop();
			this.doSwitch(this.options.images[this.index]);
			this.start();
		},

		order: function() {
			var length = this.options.images.length;
			++this.index;
			if (this.index === length) {
				this.index = 0;
			}
			if (!this.options.loop && this.index >= length - 1) {
				this.stop();
			}
		},

		random: function() {
			var length = this.options.images.length,
			    index  = this.index;
			while (this.index === index) {
				index = Math.floor(Math.random() * length);
			}
			this.index = index;
		},

		sequence: function() {
			var tmp  = [],
			    base = this.options.images[0],
			    min  = this.options.images[1],
			    max  = this.options.images[2];
			do {
				tmp.push(base.replace(/\.\w+$/, min + '$&'));
			} while (++min <= max);
			this.options.images = tmp;
		},

		preload: function() {
			if (this.loadedImages == null) {
				this.loadedImages = {};
			}
			var i = 0, images = this.options.images,
			    length = images.length, path;
			for (; i < length; ++i) {
				path = images[i];
				this.loadedImages[path] = new Image;
				this.loadedImages[path].src = path;
			}
		},

		initCloneNode: function() {
			var tagName = this.node[0].tagName.toLowerCase();

			if (tagName === 'html') {
				throw new Error('FadeOut the HTML not allowed.');
			}

			if (tagName === 'body') {
				this.initRootNode();
				tagName = 'div';
			}

			var zIndex = this.node.css('zIndex'),
			    offset = this.node.offset();

			if (isNaN(zIndex)) {
				zIndex = 1000;
				this.node.css({zIndex: zIndex});
			}

			this.cloneNode = $('<'+ tagName +'>');
			this.cloneNode.css({
				display: 'block',
				position: 'absolute',
				zIndex: zIndex - 2,
				top: offset.top,
				left: offset.left,
				width: this.node.innerWidth(),
				height: this.node.innerHeight(),
				backgroundImage: this.node.css('backgroundImage'),
				backgroundPosition: getSafeBackgroundPosition(this.node),
				backgroundRepeat: this.node.css('backgroundRepeat'),
				backgroundColor: this.node.css('backgroundColor'),
				backgroundAttachment: this.node.css('backgroundAttachment')
			});

			this.origNode = this.node;
			this.origNode.css({
				position: 'relative',
				background: 'none'
			});

			this.node = this.cloneNode.clone();
			this.node.css('zIndex', zIndex - 1);

			this.origNode.after(this.cloneNode, this.node);

			// Observe window resize event
			if (this.options.resize) {
				$(window).bind('resize.bgSwitcher', $.proxy(this.resizeHandler, this));
			}
		},

		initRootNode: function() {
			var rootNode, bodyNode, styles, edge, i, property;

			rootNode = $('> *', this.node).not('script');
			rootNode.find('script').remove();
			rootNode = rootNode.wrapAll('<div>').parent();
			bodyNode = this.node;

			styles = {
				backgroundImage: bodyNode.css('backgroundImage'),
				backgroundPosition: getSafeBackgroundPosition(bodyNode),
				backgroundRepeat: bodyNode.css('backgroundRepeat'),
				backgroundColor: bodyNode.css('backgroundColor'),
				backgroundAttachment: bodyNode.css('backgroundAttachment')
			};

			edge = ['Top', 'Bottom', 'Right', 'Left'];
			for (i = 0; i < 4; ++i) {
				property = 'padding' + edge[i];
				styles[property]  = +bodyNode.css('margin' + edge[i]).replace(/\D/g, '');
				styles[property] += +bodyNode.css('padding' + edge[i]).replace(/\D/g, '');
				styles[property] += 'px';
			}
			rootNode.css(styles);

			bodyNode.css({
				margin: 0,
				padding: 0,
				background: 'none'
			});

			this.node = rootNode;

			// Observe resize event
			this.options.resize = true;
		},

		resizeHandler: function() {
			var offset = this.origNode.offset(),
				css = {
					width: this.origNode.innerWidth(),
					top: offset.top,
					left: offset.left
				};
			this.node.css(css);
			this.cloneNode.css(css);
		},

		normalSwitch: function(imageUrl) {
			this.node.css('backgroundImage', 'url('+ imageUrl +')');
		},

		fadeSwitch: function(imageUrl) {
			var self = this;
			this.node.stop(true, true);
			this.node.css('backgroundImage', this.cloneNode.css('backgroundImage'));
			this.node.show(0, function() {
				self.cloneNode.css('backgroundImage', 'url('+ imageUrl +')');
				self.options.switchHandler.call(self);
			});
		}

	};

	function getSafeBackgroundPosition($node) {
		$node = $($node);

		var posY,
			i = 0,
			propName = 'backgroundPosition',
			ret = $node.css(propName);

		if (ret !== undefined && ret !== '0% 0%') {
			return ret;
		}

		posY = $node.css(propName + 'Y').split(', ');

		if (posY === undefined) {
			return ret;
		}

		ret = $node.css(propName + 'X').split(', ');

		for (; i < ret.length; i++) {
			ret[i] += ' ' + posY[i];
		}

		return ret.join(', ');
	}

})(jQuery);
