jQuery.BgSwitcher [![Build Status](https://travis-ci.org/rewish/jquery-bgswitcher.png?branch=master)](https://travis-ci.org/rewish/jquery-bgswitcher)
=========================

Switch the background image with using effect.

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

For example, if you want to disable the loop of switching:

```js
$(".box").bgswitcher({
  images: ["pic1.jpg", "pic2.jpg", "pic3.jpg"],
  loop: false
});
```

Configs
-------------------------

| Key      | Type    | Default | Description |
| -------- | ------- | ------- | ------------|
| images   | array   | []      | Background images |
| interval | number  | 5000    | Interval of switching |
| start    | boolean | true    | Start the switch on after initialization ([Calling the Methods](#calling-the-methods)) |
| loop     | boolean | true    | Loop the switch |
| shuffle  | boolean | false   | Shuffle the image order |
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

### Adding the effect type

First, define effect with using the `$.BgSwitcher.defineEffect()`.

```js
$.BgSwitcher.defineEffect("extraSlide", function($el) {
  $el.animate({left: $el.width()}, this.config.duration, this.config.easing);
});
```

Then, specify the effect name that you added.

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

You can call various methods, For example:

Name    | Description
------- | -----------------------------
start   | Start the switching
stop    | Stop the switching
toggle  | Toggle between start/stop
reset   | Return to the first switching
select  | Select the switching at index
next    | Go to the next switching
prev    | Go to the previous switching
destroy | !!Destroy BgSwitcher!!

Example for `select` with button:

```js
var $el = $(".box").bgswitcher({
  images: ["foo.jpg", "bar.jpg", "baz.jpg"]
});

$("button").on("click", function() {
  $el.bgswitcher("select", 1); // bar.jpg
});
```

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

Setup the modules required for testing.

```sh
git submodule update --init --recursive
```

You can testing in two ways:

* Open the `test/index.html` in the Web browser
* Command Line Testing with the PhantomJS

```sh
phantomjs lib/mocha-phantomjs/lib/mocha-phantomjs.coffee test/index.html
```

License
-------------------------

The [MIT License](https://github.com/rewish/jquery-bgswitcher/blob/master/LICENSE.md), Copyright (c) 2009-2014 [@rewish](https://github.com/rewish).
