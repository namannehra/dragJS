# dragJS
JavaScript functions for listening to `drag` events.

[Example](https://namannehra.github.io/dragJS/)

## Setup
Load the file using script tag in head

	<script src="drag-transformed.js"></script>

## Use
Call `getDragEvent` and pass an element as argumenmt

	var d = document.querySelector('#d');
	getDragEvent(d);

Now this element will fire drag events. Listen using addEventListener. The `detail` of event has following properties:

| Property | Type | Description |
| --- | --- | --- |
| state | String | 'start', 'drag' or 'end' |
| startX | Number | x coordinate where drag started in pixel |
| startY | Number | y coordinate where drag started in pixel |
| dx | Number | x coordinate of drag in pixel |
| dy | Number | y coordinate of drag in pixel |
| sourceEvent | Object | Original Pointer Event which is used it calculate drag |

Call `stopDragEvent` when you don't need the element to fire drag event as this event

	stopDragEvent(d);

`firesDragEvent` can be used to check if an element is firing drag events.

	firesDragEvent(d); //true

`drag.js` is the original file and uses `const`, `let` and `arrow functions` which may not be supported in all browsers. `drag-transformed.js` is genetared using [babeljs](https://babeljs.io/) and will work in most browsers.

## Notes
* Pointer events are required for drag events to work. Use [PEP](https://github.com/jquery/PEP) to polyfill pointer events.
* Set `touch-action` CSS property (`touch-action` attribute if using PEP) so drag events work with touch.
* Set `user-select` CSS property to none to prevent selection while draging.
* `sourceEvent` property can be use to check `isPrimary`, `pointerId`, `clientX`, `clientY` or to call `preventDefault`.
