---
{
	"layout": "layouts/docs.liquid",
	"title": "when().observes()",
	"description": "Similar to `js`when()`` simplifying event listeners, `js`when().observes()`` helps using native observers both inside and outside Yozo components."
}
---

To keep things consistent and easy to use, `js`when().observes()`` can be thought of as the observer variant of [`when().does()`](/docs/when/); their usage is very similar.

:::info
**Note:** `js`when().observes()`` is a flow-based wrapper around native observers, most notably `js`MutationObserver``, `js`IntersectionObserver`` and `js`ResizeObserver``. The options are passed to the respective observer as-is. It is probably best for authors to first get acquainted with the native forms of these APIs before using `js`when().observes()``.
:::

## Syntax

```js
when(...targets).observes(type);
when(...targets).observes(type, options);
```

### Parameters

`arg`...targets``
: One or more targets to be observed. The type of items passed here are dependent on the observed `arg`type``, though most of the time they'll be `js`Element`` objects.

`arg`type``
: The type of observer, as a string. The three main accepted values are `js`'mutation'``, `js`'intersection'`` or `js`'resize'``. Other values are also supported, even for custom observers that conform to the `js`Observer`` interface, though usability may vary. See the examples below for more information on uncommon or custom observers.

`arg`options`` <mark>optional</mark>
: The options for the observer. This is passed both as second argument to the relevant observer's constructor, and as second argument to the `js`.observe()`` call. This allows usage to be consistent across all three main observer types. In practice, this argument is only optional if it is also optional for the specified observer.

### Return value

A [`Flow`](/docs/flow/) object that triggers whenever the observer in question observes a new change. In other words; a trigger fires at the same time that a native observer's callback (passed to the constructor) is called, with the same arguments. To achieve the same basic behavior as one might with a native observer, use [`.then()`](/docs/flow/then/) to listen for triggers. To disconnect the observer, use [`.stop()`](/docs/flow/stop/), [`.until()`](/docs/flow/until/), or any other method that stops the flow. When used inside [monitored](/docs/monitor/) contexts such as inside an [`effect()`](/docs/effect/) or [`connected()`](/docs/components/connected) callback, stopping the flow manually is not not necessary; when the monitored context is cleaned up after, the observer too is disconnected and removed.

## Examples

### Mutations

The most commonly used observer is probably the `js`MutationObserver``. While the native API requires authors to create an observer object using the constructor, and subsequently pass a `js`Node`` and relevant options to the `js`.observe()`` method, the `js`when().observes()`` syntax pulls it a bit more in line with how event listeners are written. For example, we can watch the attributes on a certain `html`<div>`` element using

```js
const div = document.querySelector('div');

const options = { attributes: true };
when(div).observes('mutation', options).then(records => {
	// an attribute changed!
});
```

The callback in `js`.then()`` also receives a second parameter, `arg`observer``, beyond the `arg`records`` argument; however, usually this is used to disconnect the observer at some point. Since `js`when().observes()`` is flow-based, it is better (and often easier) to stop the flow instead, and the flow will take care of disconnecting and cleaning up after the observer.

### Intersections

Next, let's see an example for an `js`IntersectionObserver``. We'll have a graphic, and we want an animation to run once the graphic is completely visible on the screen. Additionally, we only want to run this animation once. For the `js`IntersectionObserver``, this means the options we'll need to pass are `js`{ threshold: 1 }``. Unlike the native `js`MutationObserver``, the `js`IntersectionObserver`` requires its argument to be passed to the constructor. For `js`when().observes()``, that fact is not relevant, and we can simply write:

```js
const graphic = document.querySelector('#graphic');

const options = { threshold: 1 };
when(graphic).observes('intersection', options).then(() => {
	// animate…
}).once();
```

Since we're working with a `js`Flow``, limiting the observer to one observation becomes simple with [`.once()`](/docs/flow/once/). That then takes care of disconnecting the observer. If we wanted the animation to start running when the graphic starts being visible as opposed to being entirely visible (i.e. having a `js`threshold`` of `js`0``) then we could omit the options altogether and have an even shorter

```js
const graphic = document.querySelector('#graphic');

when(graphic).observes('intersection').then(() => {
	// animate…
}).once();
```

### Custom observers

Observers follow a specific interface; specifically, they have `js`.observe()`` and `js`.disconnect()`` methods, and a constructor to which a callback is passed. They also generally have a name ending in `js`Observer``. The way `js`when().observes()`` works is that it takes the `js`type`` given and uses it to look up an observer under that name in the global scope. For example, give it `js`'mutation'``, and it find `js`MutationObserver``; but also something like `js`'reporting'`` can be passed to find the much less common `js`ReportingObserver``. It is also possible to implement your own observer and use it with `js`when().observes()``; for example, we might write a `js`MyCustomObserver``, assign it to the global scope, and observe using `js`when(…).observes('my-custom')``.

Unfortunately, the two other native observer types `js`'performance'`` and `js`'reporting'`` deviate somewhat from the main three (the DOM-related) types in terms of syntax. Specifically, they do not receive a specific object to observe, but instead observe something on a document-level. The `js`when().observes()`` syntax was not written for these specifically, so usage is a bit awkward. Let's do a short example for both of them.

For a native `js`PerformanceObserver``, there is only one parameter, an `arg`options`` argument, passed to the `js`.observes()`` method. Unfortunately, that's where `js`when().observes()`` passes the thing to observe. To make it work, we therefore need to pretend that this argument is the thing we're observing by passing it to `js`when()``:

```js
const options = { entryTypes: ['mark', 'measure'] };
when(options).observes('performance').then(list => {
	list.getEntries().forEach(entry => {
		// Log performance…
	});
});
```

Similarly, but differently, the `js`ReportingObserver`` deviates from the DOM-related observers. This one does not expect any arguments to the `js`.observe()`` method, and instead passes the options object to the constructor. As such, usage becomes awkward for a different reason; the options go in the expected place, but there is no target to pass to `js`when()``. To make it work, we'll pass `js`null`` as a target, resulting in an underlying `js`.observe(null)`` call, which works because the argument is not used.

```js
const options = { types: ['deprecation'], buffered: true };
when(null).observes('reporting', options).then(reports => {
	// Reports observed…
});
```

Since neither of these are particularly intuitive in usage, it is recommended either to write a wrapper around it or to simply use their native counterparts.

As mentioned previously, it is also possible to write custom observers and use them with `js`when().observes()``. A few notes about what `js`when().observes()`` does with each of its arguments specifically:

- Each item passed to `js`when()`` is passed as first argument to a call to a separate call to the observer's `js`.observe()`` method. That means the `js`.observe()`` method is called multiple times on the same observer if multiple targets are passed to `js`when()``.
- The `arg`type`` passed to `js`when().observes()`` is converted to PascalCase and `js`Observer`` is appended before it is looked up in the global scope. For example, `js`'mutation'`` looks for `js`window.MutationObserver``; a custom observer named `js`CoolEffectObserver`` would need a type of `js`'cool-effect'``.
- The `arg`options`` argument passed to `js`when().observes()`` is passed both as second argument to the constructor as well as the second argument to the underlying `js`.observe()`` call. This means that custom observers should not use both of these places to specify options.

Lastly, the `js`.disconnect()`` method is expected to exist on the observer and called when the flow is stopped (in a [`.cleanup()`](/docs/flow/cleanup/) handler). Yozo does not use the `js`.takeRecords()`` method, so this method is technically optional when writing a custom observer to be used with `js`when().observes()``.

## See also

- [`when()`](/docs/when/)
- [`Flow`](/docs/flow/)
- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
