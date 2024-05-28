---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.until()",
	"terms": "until flow cancel stop end callback pipeline trigger promise thenable",
	"description": "Stop a flow using the `flow.until()`{js} method using either a condition on the trigger, a promise, or another flow."
}
---

## Syntax

```js
flow.until(callback);
flow.until(thenable);
```

### Parameters

`callback`{arg}
: A callback to add onto the callback pipeline. Like [`.then()`](/docs/flow/then/), it receives the trigger arguments as parameters. If the callback returns something truthy, the flow is stopped immediately and the trigger does not continue through the rest of the pipeline.

`thenable`{arg}
: A thenable, such as another [`Flow`](/docs/flow/) object, a `Promise`{js}, or any other object with a `.then()`{js} method. The flow is stopped whenever this `thenable`{arg} triggers or resolves. When passing a `Flow`{js} then it is automatically stopped whenever the original flow stops; in other words, calling [`.once()`](/docs/flow/once/) on the passed flow is not necessary.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Examples

### Drag and drop

Let's create a simple drag-and-drop system. We'll have an element on the page we'll be dragging around, maintaining its position using `fixed`{css} positioning with dynamic `top`{css} and `left`{css} properties. We'll be using [`when()`](/docs/when/) to attach a `pointerdown`{str} event to the draggable element. In the handler, we attach a `pointermove`{str} event to the `document`{js}, keeping track of its position, until we see a `pointerup`{str} event. Our code reads much like that:

```js
const element = document.querySelector('#element');
let left = 0;
let top = 0;

when(element).pointerdowns().then(() => {
	when(document).pointermoves().then(event => {
		left += event.movementX;
		top += event.movementY;
		element.style.left = `${left}px`;
		element.style.top = `${top}px`;
	}).until(when(document).pointerups())
});
```

The `.until()`{js} method makes sure the `pointermove`{str} handler is disconnected. This is great for performance, since now the only event handler that exists while the user is not dragging is a single `pointerdown`{str} listener.

### Animations

Let's try to build a little on the previous example, but instead of dragging the element, we'll be moving it along a horizontal line using a JavaScript animation. This animation will take two seconds and it'll move the element over 500 pixels. To achieve this, we use [`frame()`](/docs/frame/) to run the code every frame, and `.until()`{js} to make sure the animation stops when the two seconds run out. Note that `frame()`{js} receives one trigger argument, a `DOMHighResTimeStamp`{js} for the current time, akin to `document.timeline.currentTime`{js}. We'll use this to calculate the offset and stop the animation at the right moment.

```js
const element = document.querySelector('#element');
const start = document.timeline.currentTime;
const duration = 2000;
const distance = 500;
frame().then(timestamp => {
	const left = (timestamp - start) / duration * distance;
	element.style.left = `${left}px`;
}).until(timestamp => timestamp - start > duration);
```

Here, instead of relying on another flow to trigger in order to stop the `frame()`{js} animation, we return a boolean depending on the `timestamp`{arg} argument indicating whether it is time to stop. Note that we could theoretically write the whole animation inside the `.until()`{js}; this is not recommended, since it might not be obvious that the `.until()`{js} handler has side effects.

## Usage notes

When `.until()`{js} stops the flow in question, no triggers are continued through the callback pipeline and the pipeline is stopped right away. This means that, when using `.until()`{js} with a callback, and it is followed up with a `.then()`{js} handler (like `.until(…).then(…)`{js}), then the `.then()`{js} handler is not run when the callback passed to `.until()`{js} returns something truthy. In that regard, it functions somewhat like [`.if()`](/docs/flow/if/).

## See also

- [`Flow`](/docs/flow/)
- [`flow.stop()`](/docs/flow/stop/)
- [`flow.then()`](/docs/flow/then/)
- [`when()`](/docs/when/)
- [`flow.if()`](/docs/flow/if/)
