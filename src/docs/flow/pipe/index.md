---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.pipe()",
	"description": "The `js`flow.pipe()`` method is a low-level API to introduce custom transformation to `js`Flow`` callback pipelines."
}
---

:::warning
**Warning:** This is a low-level API. For general use, see [`.then()`](/docs/flow/then/), [`.if()`](/docs/flow/if/), [`.await()`](/docs/flow/await/), [`.debounce()`](/docs/flow/debounce/) and [`.throttle()`](/docs/flow/throttle/). Overuse of `js`flow.pipe()`` is not recommended to keep code accessible, understandable and maintainable.
:::

## Syntax

```js
flow.pipe(callback);
```

### Parameters

`arg`callback``
: A callback function to add to the callback pipeline. This `arg`callback`` fires anytime it receives a trigger. The first argument to the callback is a `arg`next`` function, which may be called to let the trigger through to the next item in the callback pipeline. The remaining arguments are the trigger arguments. Calling `js`next()`` is optional; if it is not called, a trigger is stopped from proceeding in the callback pipeline (similar to how [`.if()`](/docs/flow/if/) or [`.debounce()`](/docs/debounce/) might).

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Examples

### Skip the first

Let's start with an example for a custom pipeline transformation that stops the first trigger it receives, but lets everything else through like `js`.then()`` would. For reusability (and because it needs to keep track of some local state), we extract the callback into its own function:

```js
function skipFirst(){
	let skippedFirst = false;
	return next => {
		if(!skippedFirst){
			next();
		}
		skippedFirst = true;
	};
}

when(button).clicks()
	.pipe(skipFirst())
	.then(() => console.log('clicked'))
```

In this example, clicking the button for the first time logs nothing, whereas clicking it any time after that logs `js`'clicked'``. If this is behavior we need to use often, then extracting it and using `js`.pipe()`` is a great way to achieve that. If we only need to do this once, however, then perhaps something without `js`.pipe()`` might be more suitable:

```js
let skippedFirst = false;
when(button).clicks().if(() => {
	if(skippedFirst){
		return true;
	}
	skippedFirst = true;
	return false;
}).then(() => {
	console.log('clicked');
});
```

### Swapping pairs

Now, let's try something a bit more complicated. We'll write a pipeline transformation that switches every pair of triggers. When a trigger comes in, we hold it, wait for another, and when that comes, we let it through and then release the held trigger. In other words, if triggers A, B, C, D, E come in, in that order, the eventual order after our transformation should be B, A, D, C (and E is still held, waiting for another trigger to swap with). As with the previous example, we extract it into its own function, and an implementation might look something like

```js
function swapPairs(){
	let held = null;
	return next => {
		if(held){
			next();
			held();
			held = null;
		} else {
			held = next;
		}
	};
}
```

To see the effect of our transformation, let's apply it to the `str`keydown`` event (for brevity's sake, on the `js`document``), since the triggers may differ in which key was pressed. This allows us to see what order they end up in.

```js
const output = document.querySelector('#output');
when(document).keydowns().pipe(swapPairs()).then(event => {
	output.textContent += event.key;
});
```

Try this in Yozo's [playground](/docs/play/), and type the "abcde" as initially mentioned. The output should be "badc".

## Usage notes

As mentioned already, this API is not to be used lightly. It exists for flexibility, but usage is generally discouraged in favor of what is provided by default.

## See also

- [`Flow`](/docs/flow/)
- [`.then()`](/docs/flow/then/)
- [`.if()`](/docs/flow/if/)
- [`.await()`](/docs/flow/await/)
- [`.debounce()`](/docs/flow/debounce/)
- [`.throttle()`](/docs/flow/throttle/)
