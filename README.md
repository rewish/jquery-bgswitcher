## Overview

Background switching plugin for jQuery

## Usage

### Apply

```js
$('#example').bgSwitcher({
  images: ['/images/image.png', 1, 5] // image1.png, image2.png, ... image5.png
});
```

### Control

```js
// Get instance
var instance = $('body').data('bgSwitcher');

// Start
instance.start();

// Stop
instance.stop();

// Toggle
instance.toggle();

// Reset
instance.reset();
```
