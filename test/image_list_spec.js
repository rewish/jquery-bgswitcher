describe('jQuery.BgSwitcher.ImageList', function() {
  var IMAGES = [
    '../demo/images/image_1.jpg',
    '../demo/images/image_2.jpg',
    '../demo/images/image_3.jpg',
    '../demo/images/image_4.jpg',
    '../demo/images/image_5.jpg'
  ];

  var SEQUENCEABLE_IMAGES = ['../demo/images/image_.jpg', 1, 5];

  var il;

  beforeEach(function() {
    il = new $.BgSwitcher.ImageList(IMAGES.concat());
  });

  describe('#constructor', function() {
    it('call #createImagesBySequence', function() {
      var spy = sinon.spy($.BgSwitcher.ImageList.prototype, 'createImagesBySequence');
      il = new $.BgSwitcher.ImageList(IMAGES);
      expect(spy.calledOnce).to.be.ok();
      spy.restore();
    });

    it('call #preload', function() {
      var spy = sinon.spy($.BgSwitcher.ImageList.prototype, 'preload');
      il = new $.BgSwitcher.ImageList(IMAGES);
      expect(spy.calledOnce).to.be.ok();
      spy.restore();
    });
  });

  describe('#isSequenceable', function() {
    it('return true if sequenceable', function() {
      il.images = SEQUENCEABLE_IMAGES;
      expect(il.isSequenceable()).to.be.ok();
    });

    it('return false if not sequenceable', function() {
      il.images = IMAGES;
      expect(il.isSequenceable()).to.not.be.ok();
    });
  });

  describe('#createImagesBySequence', function() {
    it('create images by sequence number', function() {
      il.images = ['foo.jpg', 2, 3];
      il.createImagesBySequence();
      expect(il.images).to.have.length(2);
      expect(il.images[0]).to.be('foo2.jpg');
      expect(il.images[1]).to.be('foo3.jpg');
    });
  });

  describe('#preload', function() {
    it('load an images');
  });

  describe('#shuffle', function() {
    it('shuffle an images', function() {
      il.shuffle();
      expect(il.images.join()).to.not.be(IMAGES.join());
    });
  });

  describe('#get', function() {
    it('return the image', function() {
      il.images = ['foo', 'bar', 'baz'];
      expect(il.get(0)).to.be('foo');
      expect(il.get(1)).to.be('bar');
      expect(il.get(2)).to.be('baz');
    });
  });

  describe('#url', function() {
    it('return the image URL with function of CSS', function() {
      il.images = ['foo', 'bar', 'baz'];
      expect(il.url(0)).to.be('url(foo)');
      expect(il.url(1)).to.be('url(bar)');
      expect(il.url(2)).to.be('url(baz)');
    });
  });

  describe('#count', function() {
    it('return an images length', function() {
      il.images = [1,2,3,4,5,6];
      expect(il.count()).to.be(6);
    });
  });
});