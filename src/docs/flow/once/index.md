---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.once()",
	"description": "The `flow.once()`{js} method allows one trigger through in the pipeline and simultaneously stops the flow it was called on whenever that happens."
}
---

## Syntax

```js
flow.once();
```

### Parameters

None.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on.

## Details

The `.once()`{js} method participates in the flow pipeline, but in a bit of a special way. Once a trigger reaches `.once()`{js} in the callback pipeline, two things happen.

- The trigger is allowed through to the rest of the pipeline, and
- any other triggers in the pipeline (ones that have not yet reached `.once()`{js}) are stopped in-place.

As a result, there is more flexibility in where you put `.once()`{js}, but its position in the pipeline still has meaning. In particular, this behavior is perfect for `await`{js} expressions; more about this in the ["Awaiting flows"](./#awaiting-flows) example below.

:::warning
**Warning:** Theoretically, event listeners can use the native `{ once: true }`{js} option; when using flows, it is strongly recommended to use `.once()`{js}. This is because with `.once()`{js}, on top of the event listener being cleaned up, the flow itself is also stopped, whereas with `{ once: true }`{js} the flow will remain "alive" while the underlying listener has been removed.
:::

## Examples

### Loading an image

Some events are expected to fire only once, such as the `load`{str} event. For events like these, `.once()`{js} is perfect; it takes down the flow whenever the event fires, meaning there are no concerns about memory leaks. As an example, let's use [`when()`](/docs/when/) in conjunction with `.once()`{js} to load an image and append it to the DOM.

```js
const img = document.createElement('img');
when(img).loads().once().then(() => {
	document.body.append(img);
});
img.src = '/assets/img/mythical-beast.webp';
```

It's also possible to have the `.then()`{js} call before the `.once()`{js}; in this case it doesn't matter.

### Positioning .once()

For callback pipelines using only [`.then()`](/docs/flow/then/), it doesn't matter whether `.once()`{js} is put before any `.then()`{js} methods, in between, or after. However, once other methods are thrown in the mix, it starts mattering. First, let's see what happens with [`.if()`](/docs/flow/if/).

- In `.once().if(…).then(…)`{js}, the flow is stopped as soon as it triggers, and the `.then()`{js} handler fires only if the trigger passes the condition in `.if()`{js}.
- In `.if().once(…).then(…)`{js}, the `.then()`{js} handler fires as soon as a trigger passes the condition in `.if()`{js}, at which point the flow is stopped.

Similarly, when using [`.await()`](/docs/flow/await/), [`.debounce()`](/docs/flow/debounce/), or any other asynchronous pipeline callbacks, then the position `.once()` has in the callback pipline is also relevant. To take `.debounce()`{js} as an example:

- In `.once().debounce(1000).then(…)`{js}, the flow is stopped at the first trigger, and then `.then()`{js} handler fires 1000ms after that.
- In `.debounce(1000).once().then(…)`{js}, then only after 1000ms of inactivity after the first trigger does the `.then()`{js} handler fire and the flow stops.

The `.once()`{js} method acts somewhat like a gatekeeper; it lets once trigger through, and tells all other triggers to just give up. Once the trigger that was let through reaches the end of the callback pipeline, the flow is stopped completely and cleaned.

It can also be useful to compare `.once()`{js} to `.until(() => true)`{js}. The [`.until()`](/docs/flow/until/) method stops the flow whenever its callback returns something truthy, so at first glance this might seem similar to `.once()`{js}. The main difference is that `.until()`{js} stops the flow right away, and does not let any triggers through to the rest of the callback pipeline. More specifically, `.once().then()`{js} allows the `.then()`{js} callback to run, whereas in `.until(() => true).then()`{js}, triggers never get past the `.until()`{js}.

### Awaiting flows

We can rewrite the image loading example using `await`{js}, and make it (in a way) more sequential.

```js
const img = document.createElement('img');
await when(img).loads().once().after(() => {
	img.src = '/assets/img/mythical-beast.webp';
});
document.body.append(img);
```

Here, we use [`.after()`](/docs/flow/after/) to set the `.src`{js} property on the image. This is because it is not possible to set the `.src`{js} after the `await`{js} expression, since then the image never has something to load in the first place, and we can't set the `.src`{js} before attaching the event either, because the event might fire before the event listener was even set up (even if this is not actually possible - it feels unstable, and could be possible in other similar cases).

### Defer until connected

Some components could have heavy logic they need to run to instantiate. Sometimes, that logic can be deferred to when the component first connects to the DOM. For this, we can use `.once()`{js} in together with the [`connected()`](/docs/components/connected/) hook.

```yz
<title>complex-rendering</title>
<template mode="closed">
	<div id="render-container"></div>
</template>
<script>
const renderContainer = query('#render-container');

connected(() => {
	renderComplexThingIntoContainer(renderContainer);
	// …
}).once();
</script>
```

This causes the `connected()`{js} lifecycle to fire only once; when the component disconnects and connects again, this callback is no longer fired. Note that this does mean any event listeners set up inside the handler, or otherwise [monitorable](/docs/monitor/) items, are taken down immediately. Instead, if this is not desired, there's an alternative. Instead of stopping the flow returned by `connected()`{js} immediately after it triggers (which is what `.once()`{js} does), it can instead be stopped when the component disconnects through `.until(disconnected())`{js}.

## Usage notes

Calling `.once()`{js} more than once on the same flow does nothing; only the first call is relevant to the behavior of the callback pipeline.

## See also

- [`Flow`](/docs/flow/)
- [`when()`](/docs/when/)
- [`until()`](/docs/flow/until/)
- [`if()`](/docs/flow/if/)
- [`debounce()`](/docs/flow/debounce/)
- [`connected()`](/docs/components/connected/)
