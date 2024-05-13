---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.after()",
	"description": "The `flow.after()`{js} method is used to schedule a callback, usually one that triggers the flow itself, allowing for more sequentially-written code."
}
---

## Syntax

```js
flow.after(callback);
```

### Parameters

`callback`{arg}
: A function to run after the flow has been set up and an `await`{js} expression has attached its [`.then()`](/docs/flow/then/) handler internally.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on.

## Examples

The `.after()`{js} method is primarily useful in situations where there is a need to `await`{js} a `Flow`{js}, but something needs to trigger the flow in question. It can be unreliable to run the code that triggers the flow before it is set up, because the flow might have already triggered before the `await`{js} expression has been reached. To solve this issue, we can run the triggering code inside the `.after()`{js} callback, causing it to run only after it is safe to do so.

### Loading an image

When loading an image, we'll need to create the image, then set the source, and wait for the `load`{str} event (for which we'll use [`when()`](/docs/when/)). However, if we set the image's `.src` before our `await`{js} expression, then (if the image is cached) the `load`{str} event potentially fires before the listener has been set up properly, which results in our code getting stuck on the `await`{js}. The solution is using `.after()`{js}, like so:

```js
const img = document.createElement('img');
await when(img).loads().once().after(() => {
	img.src = './bonfire.webp';
});
```

This way, we are guaranteed to receive the `load`{str} event after the flow created by `when()` has been set up. Additionally, our code is in a more intuitive order since the `when()`{js} expression should be run before the `img.src`{js} is set.

## See also

- [`Flow`](/docs/flow/)
- [`flow.then()`](/docs/flow/then/)
