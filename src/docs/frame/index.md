---
{
	"layout": "layouts/docs.liquid",
	"title": "frame()",
	"description": "The `js`frame()`` function creates a flow object that fires every frame, akin to a recursive `js`requestAnimationFrame()``."
}
---

## Syntax

```js
frame();
```

### Parameters

None.

### Return value

A [`Flow`](/docs/flow/) object that triggers every frame. The trigger receives a single argument; a `js`DOMHighResTimeStamp`` representing the time of the previous frame's rendering. This argument is the same as the argument passed to the callbacks in `js`requestAnimationFrame()``.

## Details

In a nutshell, `js`frame()`` is a more ergonomic flow-based way of using `js`requestAnimationFrame()``. Instead of firing only once, requiring authors to write their own recursion in order to run something every frame, `js`frame()`` fires every frame by default. Because it is a flow, it is easy to limit it to a single frame using [`.once()`](/docs/flow/once/), like `js`frame().once()``. Additionally, flows participate in monitored contexts, meaning `js`frame()`` calls are safe to use within [`effect()`](/docs/effect/), [`connected()`](/docs/components/connected/), and [`purify()`](/docs/purify/).

## Examples

### Fading out

Let's create an animation to fade out a certain element, without using CSS animations or transitions. We'll slowly (linearly) decrease the element's `css`opacity`` over the duration of one second, or `js`1000`` milliseconds.

```js
const element = document.querySelector('#element');
let start;
frame().then(timestamp => {
	if(!start){
		start = timestamp;
	}
	const elapsed = timestamp - start;
	const progress = elapsed / 1000;
	element.style.opacity = 1 - progress;
}).until(timestamp => {
	return timestamp - start >= 1000;
}).cleanup(() => {
	element.style.opacity = 0;
});
```

Upon the first frame, we remember the timestamp. Then, we can figure out how much time has elapsed using the `arg`timestamp`` argument the trigger receives. This is the preferred method of keeping track of progress, because it links the animation to time rather than framerate. In other words; we want users to perceive the animation the same way regardless of their monitor's capabilities. With the elapsed time, we can calculate the progress, and use an [`.until()`](/docs/flow/until/) handler to determine the point at which it is time to stop the animation. When the callback in the `js`.until()`` method returns `js`true``, the flow is stopped and cleaned up. We use the [`.cleanup()`](/docs/flow/cleanup/) handler here to make sure the animation's end state is properly set.

## Usage notes

Like `js`requestAnimationFrame()``, the `js`frame()`` function always fires _before_ the browser paints a frame. For animations, this is perfect, since the logic determines what should be painted. However, sometimes we need to wait for the browser to do layout and paint in order to run a CSS animation. For this, two consecutive `js`frame()`` triggers are needed. That's a bit awkward, so Yozo provides [`paint()`](/docs/paint/) for this specific use case.

The animation request ID returned by `js`requestAnimationFrame()`` is completely abstracted away, and there is no way to retrieve it. To stop the `js`frame()`` flow from firing, use [`.stop()`](/docs/flow/stop/) or [`.until()`](/docs/flow/until/).

## See also

- [`Flow`](/docs/flow/)
- [`flow.until()`](/docs/flow/until/)
- [`flow.stop()`](/docs/flow/stop/)
- [`paint()`](/docs/paint/)
- [`interval()`](/docs/interval/)
