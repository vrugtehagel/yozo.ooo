---
{
	"layout": "layouts/docs.liquid",
	"title": ":attribute",
	"description": "Inside component templates, bind attributes to reactive expressions by prefixing the attribute name with a colon."
}
---

## Syntax

```yz
<element :attribute="expresssion"></element>
```

### Parameters

`attr`attribute``
: The attribute name to bind the expression to.

`js`expression``
: An expression evaluating to a value, usually one with [live](/docs/live/) dependencies. The expression is assigned to the attribute as-is, which implicitly causes it to be converted to a string if it is not already one. There is one exception; when the expression evaluates to `js`null`` or `js`undefined``, the attribute is removed.

:::info
**Note:** In many cases, the [`.property`](/docs/components/template/properties/) syntax may be more appropriate, since properties don't need to do the string conversion that attributes need to. Specifically, boolean attributes don't work well with the `attr`:attribute`` syntax, needing `attr`:bool="$.condition ? '' : null`` compared to the simpler `attr`.bool="$.condition"``.
:::

## Details

Like the in-template [`.property`](/docs/components/template/properties/) syntax, assigning attributes using this syntax is equivalent to running an effect only when connected. When the custom element is disconnected from the DOM, attributes bound using this in-template syntax are not updated. When inserting the element back into the document, the effects are set up again, causing them to be set to their proper values. If the attributes need to be kept up-to-date even while the component is not connected, set them manually using an [`effect()`](/docs/effect/).

## Examples

### Custom links

Let's build a simple link component, similar to the native `html`<a>`` element. We'll define an attribute `attr`to``, that is optional, and defaults to `url`#``; that way, we can simply write `html`<custom-link>`` without having to worry about `html`<a>`` elements being invalid (since they require an `attr`href`` attribute). We'll also make the links open in a new tab, if the provided URL is not relative.

```yz
<title>custom-link</title>
<meta attribute="to" type="string" default="#">
<template mode="closed" delegates-focus="true">
	<a :href="$.to" :target="$.target">
		<slot></slot>
	</a>
</template>
<script>
live.link($.$target, () => {
	if($.to.startsWith('.') || $.to.startsWith('/')){
		return null;
	}
	return '_blank';
});
</script>
```

We've set up a [`live.link()`](/docs/live/link/) to bind `js`$.target`` to the value we pass to the `attr`:target`` attribute. When the URL given starts with a `url`.`` or `url`/``, then `js`$.target`` computes to `js`null``, causing the `attr`target`` attribute to be omitted entirely. As an alternative, we can use `js`'_self'`` instead of `js`null``, since that's the default value for the `attr`target`` attribute on `html`<a>`` elements.

## Usage notes

While it is possible to pass both a non-reactive attribute and a reactive attribute at the same time (like `yz`<element :attribute="$.value" attribute="value">``), the reactive attribute overwrites any static value already when the component connects. In general, this is advised against, since its behavior might not be obvious. Similarly, it is not advised to combine the `attr`:attribute`` syntax with the `attr`.property`` syntax if they are bound to the same thing; in this case, both will be competing to update the value whenever their live dependencies change, in an unspecified (and therefore unreliable) order.

## See also

- [`.property`](/docs/components/template/property/)
- [`effect()`](/docs/effect/)
- [`live`](/docs/live/)
- [`live.link()`](/docs/live/link/)
