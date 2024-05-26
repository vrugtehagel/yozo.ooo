---
{
	"layout": "layouts/docs.liquid",
	"title": "when()",
	"terms": "when event listener does attach add targets type options flow readable trail monitor observe",
	"description": "The `when()`{js} helper simplifies the use of event listeners both inside and outside Yozo components."
}
---

## Syntax

```js
when(...targets).does(eventType);
when(...targets).does(eventType, options);
when(...targets)[readableType]();
when(...targets)[readableType](options);
```

### Parameters

`...targets`{arg}
: One or more `EventTarget`{js} objects to attach a listener to.

`eventType`{arg}
: A string representing the event type to listen to. Equivalent to the first argument to `.addEventListener()`{js}.

`options`{arg} <mark>optional</mark>
: An options object, which is passed as third argument to `.addEventListener()`{js}. The options `once`{js} and `signal`{js} are not recommended, as more appropriate alternatives are available (specifically, [`flow.once()`](/docs/flow/once/) and [`flow.until()`](/docs/flow/until/) or [`flow.stop()`](/docs/flow/stop/) respectively).

`readableType`{arg}
: Similar to `eventType`{arg}, but with an extra rule for readability; a single trailing "s" will be stripped off from `readableType`{arg} to find the event type. This allows for much more English-sounding expressions such as `when(button).clicks()`{js} or `when(image).loads()`{js}.

### Return value

A [`Flow`](/docs/flow/) object that triggers whenever the event triggers on one of the targets. The dispatched event object is passed to the callbacks in the flow. To attach a simple listener like with `.addEventListener()`{js}, use the [`flow.then()`](/docs/flow/then/) method.

## Examples

### Basic usage

Attaching simple listeners with `when()`{js} is similar in shape to `.addEventListener()`{js}, just a tad more ergonomic and readable:

```js
when(input).inputs().then(event => {
	console.log(event.key);
});

// which is (almost) identical to...
input.addEventListener('input', event => {
	console.log(event.key);
});
```

There are a variety of advantages to using `when()`{js} over `.addEventListener()`{js}, some of which more prominant than others. The main advantage is that the calls (since they create a `Flow`{js} object) are [monitored](/docs/monitor/), which means the listeners are automatically taken down in certain contexts. For example, when writing a listener inside of the [`connected()`](/docs/components/connected/) callback of a component, the hook is monitoring the listeners created inside it and takes them down when the component disconnects. Without `when()`{js}, we'd need to manually take down the event listeners when the component disconnects. Another example of the monitoring is inside an `effect()`{js} (which re-runs when any of its [live](/docs/live/) dependencies change):

```js
effect(() => {
	const button = $.activeButton;
	when(button).clicks().then(() => {
		// do the thing…
	});
});
```

In short, it means we can stop worrying about excess event listeners that we forgot to take down, and we can focus on describing what our code does in a simple, concise manner.

### It flows

As described above, in monitored contexts, we generally don't need to worry about taking down event listeners ourselves. However, that's not the only case where `when()`{js} provides an ergonomic developer experience; since it returns a [flow](/docs/flow/), we get all the handy-dandy methods that come with flows. For example:

```js
// debouncing events
when(input).inputs().debounce(300).then(() => {
	// do heavy operation…
});

// combining event listeners
when(button).mousedowns().or(
when(button).touchstarts()).then(() => {
	// button active…
});

// stopping one event based on another
when(box).pointerdowns().then(() => {
	when(document).pointermoves().then(() => {
		// render dragging…
	}).until(when(document).pointerups());
});

// awaiting events
await when(img).loads().once()
	.after(() => img.src = '/cat.jpg');
```

For more information about flows and what you can do with them, see [flows](/docs/flow/).

### The "s" thing

When using `when()`{js}'s shorthand, a single "s" is stripped off the event name provided if there is one. To help understanding, here are some examples:

- `when(window).scrolls()`{js} listens for the `'scroll'`{js} event;
- `when(audio).pauses()`{js} listens for the `'pause'`{js} event;
- `when(...inputs).change()`{js} listens for the `'change'`{js} event;
- `when(window).appinstalled()`{js} listens for the `'appinstalled'`{js} event;
- `when(document).DOMContentLoaded()`{js} listens for the `'DOMContentLoaded'`{js} event;
- `when(fileReader).focus()`{js} listens for the `'focu'`{js} event (probably unintentional!)
- `when(media).progress()`{js} listens for the `'progres'`{js} event (also likely unintentional!)

As demonstrated above, in some cases, an extra "s" makes for a very English-sounding expression. In other cases, the event name without the "s" looks a bit better. For almost all native events, this is merely a choice to make. For a handful of events (i.e. the ones that already end in an "s"), the shorthand does not work well; most notably `focus`{str}, `keypress`{str}, `progress`{str} and `success`{str} (and some variations such as `vrdisplayfocus`{str}). For these events, use the longhand like `when(…).does('focus')`{js}.

If the shorthand feels weird, keep in mind that `.does()`{js} is always an option; it provides a more familiar string-based interface while retaining all the benefits that come with `when()`{js}.

## Usage notes

To avoid monitoring, use [`monitor.ignore()`](/docs/monitor/ignore/) either around the complete `when(…).does(…)`{js} (or the shorthand equivalent) and optionally also around the `.then()`{js} or other methods. In particular, then `when()`{js} function itself returns a "magic" object (i.e. `Proxy`{js}) that allows for the shorthand, and so does not by itself create the flow object, which is the part being monitored.

Also, note that the combination of the shorthand and the existance of `.does()`{js} means that it is not possible to listen to the `'doe'`{js} event using the shorthand. Similarly, it is not possible to listen to the `observe`{js} event using the shorthand, as [`when().observes()`](/docs/when/observes/) is reserved for observers. Luckily, these are not native events, so it is rather rare that they need to be listened to. If needed, use `.does('doe')`{js} or `.does('observe')`{js} respectively.

## See also

- [`when().observes()`](/docs/when/observes/)
- [flows](/docs/flow/)
