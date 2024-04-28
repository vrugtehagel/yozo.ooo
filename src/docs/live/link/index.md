---
{
	"layout": "layouts/docs.liquid",
	"title": "live.link()",
	"description": "With `js`live.link()``, bind any other data source to a live variable, to be used in effects or other live links."
}
---

## Syntax

```js
live.link($live, callback);
live.link($live, element);
live.link($live, options);
```

### Parameters

`arg`$live``
: A [live](/docs/live/) variable to bind to. It must be settable.

`arg`callback`` <mark>optional</mark>
: A callback function calculating a value. The callback is re-run synchronously whenever any of its live dependencies change. The function should not be `js`async``. Live variables linked in this way are read-only in the same way as when using an `arg`options`` object without `set` key.

`arg`element`` <mark>optional</mark>
: An `js`HTMLElement``. Generally, either an `html`<input>`` or `html`<textarea>``, but any element that has a `js`.value`` property and dispatches an `str`input`` event whenever said property changes is accepted.

`arg`options`` <mark>optional</mark>
: An object describing a link to any other type of data source. The options are as follows:

	`get`
	: A function retrieving the value of the data source in question. It is called right away, overwriting the value the live variable had before linking it. This function does not track its live dependencies, and it should not be `js`async``.

	`set` <mark>optional</mark>
	: A function to run when the live variable is set or otherwise changed, usually to update the data source so that their values stay in sync. After a live variable has been set, the value from the external data source is retrieved using the `get` option and the linked variable is set to that value. This can mean the value of the live variable is different from the one it is set to, if the external data source or the getter does not support said value. If omitted, the live link is effectively read-only. Setting it causes it to forcefully revert to its old value synchronously, which still dispatches [`change`](/docs/live/change/) events, as well as causing effects that depend on it to re-run.

	`js`changes`` <mark>optional</mark>
	: A [`Flow`](/docs/flow/) that triggers when the external data source is updated, used to update the live variable. Most often, this involves an event listener, which is turned into a flow using [`when()`](/docs/when/). If this property is omitted, then the link is not updated automatically, though it may be still be updated manually using `js`.now()`` on the returned `js`Flow`` (see [Return value](#return-value)).

### Return value

A [`Flow`](/docs/flow/) object, which triggers every time the live variable is updated. It can also be used to stop the live link using e.g. [`.stop()`](/docs/flow/stop/) or [`.until()`](/docs/flow/until/). If the link is set up in a [monitored](/docs/monitored/) context, then the live link is taken down when that context is [undone](/docs/monitor/undo/).

It is possible to force the live link to run its getter manually by triggering the returned `js`Flow`` using [`.now()`](/docs/flow/now/). Any arguments passed to `js`.now()`` are ignored.

## Examples

### Computed values

For this example, let's write an component that renders a monetary amount in a certain currency, depending on its attributes. We'll give it an `attr`amount`` attribute, determining the amount of money, expressed in the currency defined with the `attr`currency`` attribute. To make rendering easy for ourselves, we'll create a live link for the textual representation of the amount to `js`$.$text``, a property on the component's state variable [`$`](/docs/components/$/).

```yz
<title>formatted-money</title>
<meta attribute="amount" type="number">
<meta attribute="currency" type="string" default="USD">
<template mode="closed">
	{{ $.text }}
</template>
<script>
live.link($.$text, () => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: $.currency,
	});
	return formatter.format($.amount);
});
</script>
```

Here, we used [`<meta attribute>`](/docs/components/meta/attribute/) to create matching properties on the custom element, which also created live variables `js`$.$currency`` and `js`$.$amount``. In the `js`live.link()``, we then pass a callback that is dependent on these two live variables. This callback then re-runs whenever any of the live dependencies changes, which causes `js`$.text`` to always be up-to-date.

### Binding to inputs

Let's repeat the previous example, but instead of attributes, we use inputs in the component itself.

```yz
<title>formatted-money</title>
<template mode="closed">
	<label>
		Amount
		<input type="number" id="amount">
	</label>
	<label>
		Currency
		<input type="text" id="currency">
	</label>
	<output>
		{{ $.text }}
	</output>
</template>
<script>
const amountInput = query('#amount');
const currencyInput = query('#currency');
live.link($.$amount, amountInput);
live.link($.$currency, currencyInput);

live.link($.$text, () => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: $.currency,
	});
	return formatter.format($.amount);
});
</script>
```

Here, we first query the `yz`<input>`` elements from the template using [`query()`](/docs/components/query/), and subsequently bind the `js`$.$amount`` live variable to the right input and likewise for the currency input. We can then use those live variables in another link, so the actual rendering for the the formatted amount doesn't need to change compared to the previous example.

### Two-way binding

Sometimes, a system needs two live variables to depend on each other. They need to be kept in-sync, as their value can be derived from the other. Let's keep it simple and say we've got a live `js`$.$number`` variable on a particular component's state variable [`$`](/docs/components/$/). We then have a `js`$.$double`` variable that is always twice the value of `js`$.$number``. When setting `js`$.number``, then `js`$.double`` should update, and vice versa. In cases like these, it can be helpful to see one of the live variables as an external data source. To create the live link using an `js`options`` object, we ask ourselves these three questions:

- How do I retrieve this value from the external source?
- How do I set this value on the external source?
- When does the value in the external source change?

Each of these answers then ends up as our implementation for the three options `get`, `set` and `changes`. In this case:

```js
live.link($.$double, {
	get: () => $.number * 2,
	set: value => $.number = value / 2,
	changes: when($.$number).changes()
});
```

The resulting behavior is that `js`$.double`` always computes to twice the value of `js`$.number``, updates when `js`$.$number`` changes, and also makes sure to keep `js`$.number`` in sync when it itself is being changed.

### Link to localStorage

One source of data that would be desirable to use live variables for is `js`localStorage``. When linked to live variables, it means we never have to worry about saving or restoring data, or even about data getting out of sync across multiple tabs. Let's say we implement a user-configurable dark mode. Of course, we'd like to preserve the user's preference across page visits, and ideally even apply it to other tabs when toggled. We'll save this preference in `js`localStorage`` under the `js`'theme'`` key, with a value of either `js`'light'`` or `js`'dark'``. To make things a bit simpler, we'll store the `js`theme`` in a live object `js`$storage``.

```js
const $storage = live({});

live.link($storage.$theme, {
	get: () => localStorage.getItem('theme'),
	set: value => localStorage.setItem('theme', value),
	changes: when(window).storages()
});

// an effect for an "is-dark-theme" class on the <body>
effect(() => {
	const isDark = $storage.theme == 'dark';
	document.body.classList.toggle('is-dark-theme', isDark);
});
```

Now, we can set `js`$storage.theme = 'dark'`` from anywhere (most notably the theme toggle in our UI). The [`effect()`](/docs/effect/) we defined then handles updating the class on the `html`<body>`` element, and the `js`live.link()`` then automatically saves the value to `js`localStorage``. Altering `js`localStorage`` in one tab in turn triggers the `str`storage`` event on the `js`window`` object in other tabs, which subsequently updates the `js`$storage.$theme`` in those tabs because we passed the `js`changes`` option.

However, there's a slight optimization we can do here. The `str`storage`` event not only fires for the `js`'theme'`` key, but for all keys, and even for changes to `js`sessionStorage``, too. To avoid unnecessary calls to the getter, we can limit the triggers in the [`Flow`](/docs/flow/) returned by the [`when()`](/docs/when/) handler by using [`.if()`](/docs/flow/if/):

```js
const $storage = live({});

live.link($storage.$theme, {
	get: () => localStorage.getItem('theme'),
	set: value => localStorage.setItem('theme', value),
	changes: when(window).storages().if(event => {
		const { storageArea, key } = event;
		return storageArea == localStorage && key == 'theme';
	})
});
```

This results in the link only retrieving the value when absolutely necessary, leading to better overall performance.

## Usage notes

When linking component state variables (i.e. those under [`$`](/docs/components/$/)) to external live variables (those not under `js`$``), make sure to run `js`live.link()`` inside a [`connected()`](/docs/components/connected/) callback. Failing to do so results in a memory leak, because then the external live variables are referenced to by the state variable (a listener is attached), which is referenced by the custom element iself. This essentially means the element instances cannot be garbage collected. When used in a `js`connected()`` callback, however, the link is taken down as soon as the element disonnects, and thus it is not stopping the element from being garbage collected.

A live variable must be settable for it to be linkable; that is, if `js`$value`` is a live variable with value `js`null``, then while it is still possible to create `js`$value.$foo``, that live variable is not linkable because setting it to any value is an error.

## See also

- [`live()`](/docs/live/)
- [`Flow`](/docs/flow/)
- [`$`](/docs/components/$/)
- [`when()`](/docs/when/)
- [`connected()`](/docs/components/connected/)
