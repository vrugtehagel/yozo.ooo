---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.if()",
	"terms": "if flow conditional trigger callback pipeline stop filter callback",
	"description": "Using `flow.if()`{js}, filter out triggers from the callback pipeline."
}
---

## Syntax

```js
flow.if(callback);
```

### Parameters

`callback`{arg}
: The callback to add onto the callback pipeline. If it returns something truthy, the trigger is let through to the next callback in the pipeline. Otherwise, the trigger is stopped and removed from the pipeline. The callback receives the trigger arguments as arguments, just like other pipeline-related methods, like [`.then()`](/docs/flow/then/) do.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Examples

The `.if()`{js} method is primarily useful in two cases; either the flow is passed to another function (such as [`live.link()`](/docs/live/link/)) or the rest of the callback pipeline is non-linear (e.g. using [`.throttle()`](/docs/flow/throttle/), [`.once()`](/docs/flow/once/) or [`.pipe()`](/docs/flow/pipe/)). Let's do an example for either of these cases.

### Link to localStorage

When binding a live variable to an item in `localStorage`{js}, generally it is desired to keep it up-to-date even if this item changes in a different tab or browsing context. The `window`{js} object emits a `storage`{str} event, but this event fires for all changes to `localStorage`{js}, and even for other types of storage such as `sessionStorage`{js}. To avoid our [`live.link()`](/docs/live/link/) from unnecessarily running updates, we can use `.if()`{js} to limit the amount of triggers passed to our link.

```js
live.link($.$username, {
	get: () => localStorage.getItem('username'),
	set: value => localStorage.setItem('username', value),
	changes: when(window).storages().if(event => {
		const { storageArea, key } = event;
		return storageArea == localStorage && key == 'username';
	})
});
```

The flow passed to `live.link()`{js} now triggers only when the storage type is `localStorage`{js} and when the key changed is `'username'`{js}. The link thus runs the getter much less often, resulting in better performance.

### Await enter key

Let's write a simple async version of the native `window.prompt()`{js}. We'll add an `<input>`{html} element to the document (ignoring styling for the sake of the example). Our `asyncPrompt()`{js} function is to return a value after the user presses the `'Enter'`{js} key. To write our code nice and sequentially, we'll use [`when()`](/docs/when/) to listen for `keydown`{str} events, and use [`.once()`](/docs/flow/once/) to stop the listener after it has fired. We'll need to use an `.if()`{js} before the `.once()`{js} call to make sure our `await`{js} expression only resolves when we press the `'Enter'`{js} key, instead of just any key.

```js
async function asyncPrompt(){
	const input = document.createElement('input')
	document.body.append(input)
	await when(input).keydowns()
		.if(event => event.key == 'Enter')
		.once()
	input.remove()
	return input.value
}
```

Note that [`.until()`](/docs/flow/until/) wouldn't quite work here, because once its callback returns something truthy, it stops the flow immediately, preventing the `await`{js} expression from ever resolving. On the other hand, `.once()`{js} allows a single received trigger to run through the rest of the callback pipeline, making it perfect for this case in conjunction with `.if()`.

## Usage notes

If the callback pipline is linear apart from the `.if()`{js} call, then the `.if()`{js} method could be replaced by a regular `if`{js} statement. For example, when writing `.if().then()`{js}, we can instead remove the `.if()`{js} method, and wrap our `.then()`{js} callback with a regular `if()`{js} statement (or start it with an early `return`{js}). The latter is usually a bit simpler to understand and maintain and is therefore recommended where applicable.

## See also

- [`flow.then()`](/docs/flow/then/)
- [`Flow`](/docs/flow/)
- [`live.link()`](/docs/live/link/)
