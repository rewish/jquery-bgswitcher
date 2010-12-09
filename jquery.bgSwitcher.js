/**
 * jQuery.bgSwitcher
 *
 * @version    0.2.4-beta
 * @author     Hiroshi Hoaki <rewish.org@gmail.com>
 * @copyright  2010 Hiroshi Hoaki
 * @license    http://rewish.org/license/mit The MIT License
 * @link       http://rewish.org/javascript/jquery_bg_switcher
 */
(function($) {

	$.fn.bgSwitcher = function(config, debug) {
		return this.each(function() {
			try {
				$(this).data('bgSwitcher', new $.bgSwitcher(this, config));
			} catch(e) {
				if (debug) {
					alert(e);
				}
			}
		});
	};

	$.bgSwitcher = function(node, config) {
		this.node = $(node);
		this.setConfig(config);
		this.initialize();
		return {
			start : $.proxy(this.start,  this),
			stop  : $.proxy(this.stop,   this),
			toggle: $.proxy(this.toggle, this),
			reset : $.proxy(this.reset,  this)
		};
	};

	$.bgSwitcher.prototype = {

		setConfig: function(config) {
			this.config = $.extend({
				images   : null,
				interval : 5000,
				autoStart: true,
				fadeSpeed: 1000,
				loop     : true,
				random   : false,
				resize   : false
			}, config);

			if (!(this.config['images'] instanceof Array)) {
				throw new Error('config["images"] is invalid.');
			}

			if (typeof this.config['images'][0] === 'string'
					&& typeof this.config['images'][1] === 'number'
					&& typeof this.config['images'][2] === 'number') {
				this.sequence();
			}

			if (this.config['images'].length <= 1) {
				throw new Error('Image must be at least more than two.');
			}
		},

		initialize: function() {
			this.preload();

			this.index = -1;
			this.next  = this.config['random'] ? this.random : this.order;
			this.next();
			this.normalSwitch(this.config['images'][this.index]);

			if (this.config['fadeSpeed'] > 0) {
				this.initFadeNode();
				this.doSwitch = this.fadeSwitch;
			} else {
				this.doSwitch = this.normalSwitch;
			}

			if (this.config['autoStart']) {
				this.start();
			}

			var self = this;
			if (this.config['resize']) {
				$(window).bind('resize.bgSwitcher', $.proxy(this.resizeHandler, this));
			}
		},

		start: function() {
			if (this.timeId) {
				return;
			}
			var self = this;
			this.timeId = setInterval(function() {
				self.next();
				self.doSwitch(self.config['images'][self.index]);
			}, self.config['interval']);
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
			this.doSwitch(this.config['images'][this.index]);
			this.start();
		},

		order: function() {
			var length = this.config['images'].length;
			this.index++;
			if (this.index === length) {
				this.index = 0;
			}
			if (!this.config['loop'] && this.index >= length - 1) {
				this.stop();
			}
		},

		random: function() {
			var length = this.config['images'].length,
			    index  = this.index;
			while (this.index === index) {
				index = Math.floor(Math.random() * length);
			}
			this.index = index;
		},

		sequence: function() {
			var tmp  = [],
			    base = this.config['images'][0],
			    min  = this.config['images'][1],
			    max  = this.config['images'][2];
			for (i = min; i <= max; ++i) {
				tmp.push(base.replace(/\.\w+$/, i + '$&'));
			}
			this.config['images'] = tmp;
		},

		preload: function() {
			this.loadedImages = [];
			var len = this.config['images'].length;
			for (var i = 0; i < len; ++i) {
				this.loadedImages[i] = new Image;
				this.loadedImages[i].src = this.config['images'][i];
			}
		},

		initFadeNode: function() {
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

			this.fadeNode = $('<'+ tagName +'>');
			this.fadeNode.css({
				dispaly: 'block',
				position: 'absolute',
				zIndex: zIndex - 1,
				top: offset.top,
				left: offset.left,
				width: this.node.innerWidth(),
				height: this.node.innerHeight(),
				backgroundImage: this.node.css('backgroundImage'),
				backgroundPosition: this.node.css('backgroundPosition') || [
					this.node.css('backgroundPositionX'),
					this.node.css('backgroundPositionY')
				].join(' '),
				backgroundRepeat: this.node.css('backgroundRepeat'),
				backgroundColor: this.node.css('backgroundColor'),
				backgroundAttachment: this.node.css('backgroundAttachment')
			});

			this.origNode = this.node;
			this.origNode.css({
				position: 'relative',
				background: 'none'
			});

			this.node = this.fadeNode.clone();
			this.node.css('zIndex', zIndex - 2);

			this.origNode.after(this.fadeNode, this.node);
		},

		initRootNode: function() {
			var id = 'bgSwitcher-' + +new Date;

			$('> *', this.node).not('script').wrapAll('<div id="'+ id +'">');

			var rootNode = $('#' + id),
			    bodyNode = this.node;

			var styles = {
				backgroundImage: bodyNode.css('backgroundImage'),
				backgroundPosition: bodyNode.css('backgroundPosition') || [
					bodyNode.css('backgroundPositionX'),
					bodyNode.css('backgroundPositionY')
				].join(' '),
				backgroundRepeat: bodyNode.css('backgroundRepeat'),
				backgroundColor: bodyNode.css('backgroundColor'),
				backgroundAttachment: bodyNode.css('backgroundAttachment')
			};
			var edge = ['Top', 'Bottom', 'Right', 'Left'];
			for (var i = 0; i < 4; ++i) {
				var property = 'padding' + edge[i];
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
			this.config['resize'] = true;
		},

		resizeHandler: function() {
			var width = this.origNode.innerWidth();
			this.node.width(width);
			this.fadeNode.width(width);
		},

		normalSwitch: function(imageUrl) {
			this.node.css('backgroundImage', 'url('+ imageUrl +')');
		},

		fadeSwitch: function(imageUrl) {
			var self = this;
			this.fadeNode.stop(true, true);
			this.fadeNode.css('backgroundImage', this.node.css('backgroundImage'));
			this.fadeNode.show(0, function() {
				self.node.css('backgroundImage', 'url('+ imageUrl +')');
				self.fadeNode.fadeOut(self.config['fadeSpeed']);
			});
		}

	};

})(jQuery);
