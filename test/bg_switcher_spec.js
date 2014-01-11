describe('jQuery.BgSwitcher', function() {
  var INTERVAL = 10000;

  var bs;
  var el = document.getElementById('sandbox');

  beforeEach(function() {
    bs = new $.BgSwitcher(el);
  });

  afterEach(function() {
    bs.destroy();
  });

  describe('#constructor', function() {
    it('set an element wrapped in jQuery', function() {
      expect(bs.$el[0]).to.be(el);
    });

    it('set 0 to index', function() {
      expect(bs.index).to.be(0);
    });

    it('set config based on the default config', function() {
      var key, defaultConfig = bs.constructor.defaultConfig;
      for (key in defaultConfig) {
        expect(bs.config).to.have.property(key, defaultConfig[key]);
      }
    });

    it('setup background element', function() {
      expect(bs.$bg).to.not.be(undefined);
    });

    it('listen to the resize event of window', function() {
      bs._adjustRectangle = sinon.spy();
      $(window).trigger('resize');
      expect(bs._adjustRectangle.calledOnce).to.be.ok();
    });
  });

  describe('#dispatch', function() {
    context('when call with string', function() {
      it('should be call "method name" with args', function() {
        var first = {}, second = {};
        bs.fooMethod = sinon.spy();
        bs.dispatch('fooMethod', first, second);
        expect(bs.fooMethod.calledOnce).to.be.ok();
        expect(bs.fooMethod.calledWith(first, second)).to.be.ok();
      });
    });

    context('when call with object', function() {
      it('should be call #setConfig with object', function() {
        var object = {};
        bs.setConfig = sinon.spy();
        bs.dispatch(object);
        expect(bs.setConfig.calledOnce).to.be.ok();
        expect(bs.setConfig.calledWith(object)).to.be.ok();
      });
    });

    context('when call with unknown type', function() {
      it('should be throw error', function() {
        expect(bs.dispatch).to.throwException();
        expect(bs.dispatch).withArgs(undefined).to.throwException();
        expect(bs.dispatch).withArgs(function(){}).to.throwException();
      });
    });
  });

  describe('#setConfig', function() {
    it('merge into the config from first arg', function() {
      var config = {foo: {}, bar: {}};
      bs.setConfig(config);
      expect(bs.config).to.have.property('foo', config.foo);
      expect(bs.config).to.have.property('bar', config.bar);
    });

    context('when "random" is specified', function() {
      it('set "random" to "shuffle"', function() {
        bs.setConfig({random: {}});
        expect(bs.config).to.have.property('shuffle', bs.config.random);
      });
    });

    it('should be call #refresh', function() {
      bs.refresh = sinon.spy();
      bs.setConfig();
      expect(bs.refresh.calledOnce).to.be.ok();
    });

    // Describe a more specs in #refresh
  });

  describe('#setImages', function() {
    it('set an instance of ImageList to the imageList', function() {
      bs.setImages([]);
      expect(bs.imageList).to.be.an(bs.constructor.ImageList);
    });
  });

  describe('#setSwitchHandler', function() {
    it('set function to switchHandler', function() {
      bs.setSwitchHandler(function() {
        expect(this).to.be(bs);
      });
      bs.switchHandler();
    });
  });

  describe('#getBuiltInSwitchHandler', function() {
    it('return built-lt handler at config.effect', function() {
      bs.config = {effect: 'clip'};
      expect(bs.getBuiltInSwitchHandler()).to.be(bs.constructor.switchHandlers.clip);
    });

    context('when specified type', function() {
      it('return built-in handler at type', function() {
        expect(bs.getBuiltInSwitchHandler('drop')).to.be(bs.constructor.switchHandlers.drop);
      });
    });
  });

  describe('#start', function() {
    beforeEach(function() {
      bs.setConfig({
        interval: INTERVAL,
        start: false
      });
    });

    it('call #next after config.interval', function() {
      var clock = sinon.useFakeTimers();

      bs.next = sinon.spy();
      bs.start();

      clock.tick(INTERVAL - 1);
      expect(bs.next.called).to.not.be.ok();

      clock.tick(1);
      expect(bs.next.calledOnce).to.be.ok();

      clock.restore();
    });
  });

  describe('#stop', function() {
    beforeEach(function() {
      bs.setConfig({
        interval: INTERVAL,
        start: false
      });
    });

    it('kill the switching timer', function() {
      var clock = sinon.useFakeTimers();

      bs.next = sinon.spy();
      bs.start();
      bs.stop();

      clock.tick(INTERVAL);
      expect(bs.next.called).to.not.be.ok();

      clock.restore();
    });
  });

  describe('#toggle', function() {
    beforeEach(function() {
      bs.setConfig({
        interval: INTERVAL,
        start: false
      });
    });

    it('call alternately #start/#stop', function() {
      var start = bs.start,
          stop = bs.stop;

      bs.start = sinon.spy();
      bs.stop = sinon.spy();

      bs.toggle();
      expect(bs.start.callCount).to.be(1);
      expect(bs.stop.callCount).to.be(0);

      start.call(bs);
      bs.toggle();
      expect(bs.start.callCount).to.be(1);
      expect(bs.stop.callCount).to.be(1);

      stop.call(bs);
      bs.toggle();
      expect(bs.start.callCount).to.be(2);
      expect(bs.stop.callCount).to.be(1);
    });
  });

  describe('#next', function() {
    beforeEach(function() {
      bs.setConfig({images: ['foo', 'bar', 'baz']});
    });

    it('go to next switching', function() {
      bs.next();
      expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('bar');
      bs.next();
      expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('baz');
      bs.next();
      expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('foo');
    });

    context('when config.loop is false', function() {
      it('should stop if reaches the last index', function() {
        bs.config.loop = false;
        bs.next();
        bs.next();
        bs.next();
        expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('baz');
      });
    });
  });

  describe('#prev', function() {
    beforeEach(function() {
      bs.setConfig({images: ['foo', 'bar', 'baz']});
    });

    it('go to previous switching', function() {
      bs.prev();
      expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('baz');
      bs.prev();
      expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('bar');
      bs.prev();
      expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('foo');
    });

    context('when config.loop is false', function() {
      it('should stop if reaches the last index', function() {
        bs.config.loop = false;
        bs.prev();
        expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('foo');
      });
    });
  });

  describe('#select', function() {
    beforeEach(function() {
      bs.setConfig({images: ['foo', 'bar', 'baz']});
    });

    it('select switching at index', function() {
      bs.select(0);
      expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('foo');
      bs.select(1);
      expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('bar');
    });

    context('when the index is -1', function() {
      it('select the last switching', function() {
        bs.select(-1);
        expect(bs.$bg.css('backgroundImage').split('/').pop()).to.have.contain('baz');
      });
    });
  });

  describe('#switching', function() {
    beforeEach(function() {
      bs.setConfig({interval: INTERVAL});
    });

    it('call switchHandler with $switchable', function() {
      bs.switchHandler = sinon.spy();
      bs.switching();
      expect(bs.switchHandler.calledOnce).to.be.ok();
      expect(bs.switchHandler.calledWith(bs.$switchable)).to.be.ok();
    });

    context('when starting the timer', function() {
      beforeEach(function() {
        bs.start();
      });

      it('should be call #stop', function() {
        bs.stop = sinon.spy();
        bs.switching();
        expect(bs.stop.calledOnce).to.be.ok();
      });

      it('should be call #start', function() {
        bs.start = sinon.spy();
        bs.switching();
        expect(bs.start.calledOnce).to.be.ok();
      });
    });
  });

  describe('#refresh', function() {
    beforeEach(function() {
      bs.config = {
        images: [],
        effect: 'clip'
      };
    });

    it('call #setImages with config.images', function() {
      bs.setImages([]); // Avoid an errors
      bs.setImages = sinon.spy();
      bs.refresh();
      expect(bs.setImages.calledOnce).to.be.ok();
      expect(bs.setImages.calledWith(bs.config.images)).to.be.ok();
    });

    it('call #setSwitchHandler with built-in switch handler', function() {
      bs.setSwitchHandler = sinon.spy();
      bs.refresh();
      expect(bs.setSwitchHandler.calledOnce).to.be.ok();
      expect(bs.setSwitchHandler.calledWith(bs.constructor.switchHandlers.clip)).to.be.ok();
    });

    context('when config.start is true', function() {
      it('should be call #start', function() {
        bs.config.start = true;
        bs.start = sinon.spy();
        bs.refresh();
        expect(bs.start.calledOnce).to.be.ok();
      });
    });

    context('when config.start is false', function() {
      it('should be not call #start', function() {
        bs.config.start = false;
        bs.start = sinon.spy();
        bs.refresh();
        expect(bs.start.calledOnce).to.not.be.ok();
      });
    });
  });

  describe('#_adjustRectangle', function() {
    it('adjust the $bg rectangle from the $el rectangle');
  });

  describe('#_copyBackgroundStyles', function() {
    it('copy background-position or background-position-(x|y)', function() {
      bs.$el.css('backgroundPosition', '123px 456px');
      bs._copyBackgroundStyles();
      expect(bs.$bg.attr('style')).match(/123px 456px/);
    });
  });

  describe('.defineEffect', function() {
    it('should be set a function', function() {
      var fn = function() {};
      $.BgSwitcher.defineEffect('foo', fn);
      expect($.BgSwitcher.switchHandlers.foo).to.be(fn);
    });
  });
});
