jQuery.BgSwitcher
=========================

Overview
-------------------------

Switch the background image with effects.

Demo
-------------------------

http://rewish.github.io/jquery-bgswitcher/

Usage
-------------------------

```html
<div class="box">
  <p>Lorem ipsum dolor sit amet.</p>
</div>
```

```js
$(".box").bgswitcher({
  images: ["pic1.jpg", "pic2.jpg", "pic3.jpg"],
  ... Something Config ...
});
```

Config
-------------------------

| Key      | Type    | Default | Description |
| -------- | ------- | ------- | ------------|
| images   | Array   | []      | Background images |
| interval | number  | 5000    | Interval of switching |
| start    | boolean | true    | Start the switching at call `$.fn.bgswitcher(config)` ([Calling the Methods](#calling-the-methods)) |
| loop     | boolean | true    | Loop the switching |
| shuffle  | boolean | false   | Shuffle the order of an images |
| effect   | string  | fade    | Effect type ([Built-In effect types](#built-in-effect-types)) |
| duration | number  | 1000    | Effect duration |
| easing   | string  | swing   | Effect easing |

Effect Types
-------------------------

### Built-In effect types

* fade
* blind
* clip
* slide
* drop
* hide (No effect)

### Adding an effect types

First, Adding a method to `switchHandlers`.

```js
$.BgSwitcher.switchHandlers.extraSlide = function($el) {
  $el.animate({right: -$el.width()}, this.config.duration, this.config.easing);
};
```

Then, Specify the method name that you added.

```js
$(".box").bgswitcher({
  images: ["pic1.jpg", "pic2.jpg", "pic3.jpg"],
  effect: "extraSlide"
});
```

Calling the Methods
-------------------------

Support the method calls like jQuery UI Widget.

```js
$(".box").bgswitcher("method name");
```

You can call various methods, For example...

| Name    | Description |
| ------- | ----------- |
| start   | Start the switching |
| stop    | Stop the switching |
| toggle  | Toggle between start/stop |
| reset   | Return to the first switching |
| next    | To the next switching |
| prev    | To the previous switching |
| destroy | !!Destroy BgSwitcher!! |

Dependencies
-------------------------

Requires jQuery 1.7.x or higher.

Support browsers
-------------------------

* IE7+
* and modern browsers
* Mobile Safari

Running the Tests
-------------------------

Setup a modules required for testing.

```sh
git submodule update --init --recursive
```

You can testing in two ways:

* Open the `spec/index.html` in the Web browser
* Command Line Testing with the PhantomJS

```sh
phantomjs lib/mocha-phantomjs/lib/mocha-phantomjs.coffee spec/index.html
```

License
-------------------------

The [MIT License](https://github.com/rewish/jquery-bgswitcher/README.md), Copyright (c) 2009-2013 [@rewish](https://github.com/rewish).
