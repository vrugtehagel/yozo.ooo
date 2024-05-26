---
{
	"layout": "layouts/docs.liquid",
	"title": "when().observes()",
	"terms": "when observes mutat resize intersect flow options target type",
	"description": "Similar to `when()`{js} simplifying event listeners, `when().observes()`{js} helps using native observers both inside and outside Yozo components."
}
---

To keep things consistent and easy to use, `when().observes()`{js} can be thought of as the observer variant of [`when().does()`](/docs/when/); their usage is very similar.

:::info
**Note:** `when().observes()`{js} is a flow-based wrapper around native observers, most notably `MutationObserver`{js}, `IntersectionObserver`{js} and `ResizeObserver`{js}. The options are passed to the respective observer as-is. It is probably best for authors to first get acquainted with the native forms of these APIs before using `when().observes()`{js}.
:::

## Syntax

```js
when(...targets).observes(type);
when(...targets).observes(type, options);
```

### Parameters

`...targets`{arg}
: One or more targets to be observed. The type of items passed here are dependent on the observed `type`{arg}, though most of the time they'll be `Element`{js} objects.

`type`{arg}
: The type of observer, as a string. The three main accepted values are `'mutation'`{js}, `'intersection'`{js} or `'resize'`{js}. Other values are also supported, even for custom observers that conform to the `Observer`{js} interface, though usability may vary. See the examples below for more information on uncommon or custom observers.

`options`{arg} <mark>optional</mark>
: The options for the observer. This is passed both as second argument to the relevant observer's constructor, and as second argument to the `.observe()`{js} call. This allows usage to be consistent across all three main observer types. In practice, this argument is only optional if it is also optional for the specified observer.

### Return value

A [`Flow`](/docs/flow/) object that triggers whenever the observer in question observes a new change. In other words; a trigger fires at the same time that a native observer's callback (passed to the constructor) is called, with the same arguments. To achieve the same basic behavior as one might with a native observer, use [`.then()`](/docs/flow/then/) to listen for triggers. To disconnect the observer, use [`.stop()`](/docs/flow/stop/), [`.until()`](/docs/flow/until/), or any other method that stops the flow. When used inside [monitored](/docs/monitor/) contexts such as inside an [`effect()`](/docs/effect/) or [`connected()`](/docs/components/connected) callback, stopping the flow manually is not not necessary; when the monitored context is cleaned up after, the observer too is disconnected and removed.

## Examples

### Mutations

The most commonly used observer is probably the `MutationObserver`{js}. While the native API requires authors to create an observer object using the constructor, and subsequently pass a `Node`{js} and relevant options to the `.observe()`{js} method, the `when().observes()`{js} syntax pulls it a bit more in line with how event listeners are written. For example, we can watch the attributes on a certain `<div>`{html} element using

```js
const div = document.querySelector('div');

const options = { attributes: true };
when(div).observes('mutation', options).then(records => {
	// an attribute changed!
});
```

The callback in `.then()`{js} also receives a second parameter, `observer`{arg}, beyond the `records`{arg} argument; however, usually this is used to disconnect the observer at some point. Since `when().observes()`{js} is flow-based, it is better (and often easier) to stop the flow instead, and the flow will take care of disconnecting and cleaning up after the observer.

### Intersections

Next, let's see an example for an `IntersectionObserver`{js}. We'll have a graphic, and we want an animation to run once the graphic is completely visible on the screen. Additionally, we only want to run this animation once. For the `IntersectionObserver`{js}, this means the options we'll need to pass are `{ threshold: 1 }`{js}. Unlike the native `MutationObserver`{js}, the `IntersectionObserver`{js} requires its argument to be passed to the constructor. For `when().observes()`{js}, that fact is not relevant, and we can simply write:

```js
const graphic = document.querySelector('#graphic');

const options = { threshold: 1 };
when(graphic).observes('intersection', options).then(() => {
	// animate…
}).once();
```

Since we're working with a `Flow`{js}, limiting the observer to one observation becomes simple with [`.once()`](/docs/flow/once/). That then takes care of disconnecting the observer. If we wanted the animation to start running when the graphic starts being visible as opposed to being entirely visible (i.e. having a `threshold`{js} of `0`{js}) then we could omit the options altogether and have an even shorter

```js
const graphic = document.querySelector('#graphic');

when(graphic).observes('intersection').then(() => {
	// animate…
}).once();
```

### Custom observers

Observers follow a specific interface; specifically, they have `.observe()`{js} and `.disconnect()`{js} methods, and a constructor to which a callback is passed. They also generally have a name ending in `Observer`{js}. The way `when().observes()`{js} works is that it takes the `type`{js} given and uses it to look up an observer under that name in the global scope. For example, give it `'mutation'`{js}, and it find `MutationObserver`{js}; but also something like `'reporting'`{js} can be passed to find the much less common `ReportingObserver`{js}. It is also possible to implement your own observer and use it with `when().observes()`{js}; for example, we might write a `MyCustomObserver`{js}, assign it to the global scope, and observe using `when(…).observes('my-custom')`{js}.

Unfortunately, the two other native observer types `'performance'`{js} and `'reporting'`{js} deviate somewhat from the main three (the DOM-related) types in terms of syntax. Specifically, they do not receive a specific object to observe, but instead observe something on a document-level. The `when().observes()`{js} syntax was not written for these specifically, so usage is a bit awkward. Let's do a short example for both of them.

For a native `PerformanceObserver`{js}, there is only one parameter, an `options`{arg} argument, passed to the `.observes()`{js} method. Unfortunately, that's where `when().observes()`{js} passes the thing to observe. To make it work, we therefore need to pretend that this argument is the thing we're observing by passing it to `when()`{js}:

```js
const options = { entryTypes: ['mark', 'measure'] };
when(options).observes('performance').then(list => {
	list.getEntries().forEach(entry => {
		// Log performance…
	});
});
```

Similarly, but differently, the `ReportingObserver`{js} deviates from the DOM-related observers. This one does not expect any arguments to the `.observe()`{js} method, and instead passes the options object to the constructor. As such, usage becomes awkward for a different reason; the options go in the expected place, but there is no target to pass to `when()`{js}. To make it work, we'll pass `null`{js} as a target, resulting in an underlying `.observe(null)`{js} call, which works because the argument is not used.

```js
const options = { types: ['deprecation'], buffered: true };
when(null).observes('reporting', options).then(reports => {
	// Reports observed…
});
```

Since neither of these are particularly intuitive in usage, it is recommended either to write a wrapper around it or to simply use their native counterparts.

As mentioned previously, it is also possible to write custom observers and use them with `when().observes()`{js}. A few notes about what `when().observes()`{js} does with each of its arguments specifically:

- Each item passed to `when()`{js} is passed as first argument to a call to a separate call to the observer's `.observe()`{js} method. That means the `.observe()`{js} method is called multiple times on the same observer if multiple targets are passed to `when()`{js}.
- The `type`{arg} passed to `when().observes()`{js} is converted to PascalCase and `Observer`{js} is appended before it is looked up in the global scope. For example, `'mutation'`{js} looks for `window.MutationObserver`{js}; a custom observer named `CoolEffectObserver`{js} would need a type of `'cool-effect'`{js}.
- The `options`{arg} argument passed to `when().observes()`{js} is passed both as second argument to the constructor as well as the second argument to the underlying `.observe()`{js} call. This means that custom observers should not use both of these places to specify options.

Lastly, the `.disconnect()`{js} method is expected to exist on the observer and called when the flow is stopped (in a [`.cleanup()`](/docs/flow/cleanup/) handler). Yozo does not use the `.takeRecords()`{js} method, so this method is technically optional when writing a custom observer to be used with `when().observes()`{js}.

## See also

- [`when()`](/docs/when/)
- [`Flow`](/docs/flow/)
- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
