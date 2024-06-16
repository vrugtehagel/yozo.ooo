---
{
	"title": ":attribute",
	"terms": "dynamic attribute class name shorthand inline component template bind reactive expression colon",
	"description": "Inside component templates, bind attributes to reactive expressions by prefixing the attribute name with a colon."
}
---

## Syntax

```yz
<element :attribute="expresssion"></element>
<element :class+name="condition"></element>
```

### Parameters

`:attribute`{attr}
: The attribute name to bind the expression to, prefixed with a colon.

`expression`{js}
: An expression evaluating to a value, usually one with [live](/docs/live/) dependencies. The expression is assigned to the attribute as-is, which implicitly causes it to be converted to a string if it is not already one. There is one exception; when the expression evaluates to `null`{js} or `undefined`{js}, the attribute is removed.

`:class+name`{attr}
: A special case for handling individual classes. The class is included if the `expression`{js} evaluates to something truthy. Note that, because attributes are cases-insensitive, it is not possible to set class names with uppercase characters using this form. Additionally, it is not advised to mix a dynamic `:class`{attr} attribute with individual `:class+name`{attr} expressions, since the `:class`{attr} attribute would overwrite any individually toggled classes whenever it updates. It is however perfectly fine to use a `class`{attr} attribute with `:class+name`{attr} expressions, since the `class`{attr} never updates (and therefore never overwrites dynamic classes).

`condition`{js}
: An expression determining whether to toggle the class name on or off.

:::info
**Note:** In many cases, the [`.property`](/docs/components/template/properties/) syntax may be more appropriate, since properties don't need to do the string conversion that attributes need to. Specifically, boolean attributes don't work well with the `:attribute`{attr} syntax, needing `:bool="$.condition ? '' : null"`{yzattr} compared to the simpler `.bool="$.condition"`{yzattr}.
:::

## Details

Like the in-template [`.property`](/docs/components/template/properties/) syntax, assigning attributes using this syntax is equivalent to running an effect only when connected. When the custom element is disconnected from the DOM, attributes bound using this in-template syntax are not updated to avoid unnecessary work. When inserting the element back into the document, the effects are set up again, causing them to be set to their proper values. If the attributes need to be kept up-to-date even while the component is not connected, set them manually using an [`effect()`](/docs/effect/).

## Examples

### Custom links

Let's build a simple link component, similar to the native `<a>`{html} element. We'll define an attribute `to`{attr}, that is optional, and defaults to `#`{url}; that way, we can simply write `<custom-link>`{html} without having to worry about `<a>`{html} elements being invalid (since they require an `href`{attr} attribute). We'll also make the links open in a new tab, if the provided URL is not relative.

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

We've set up a [`live.link()`](/docs/live/link/) to bind `$.target`{js} to the value we pass to the `:target`{attr} attribute. When the URL given starts with a `.`{url} or `/`{url}, then `$.target`{js} computes to `null`{js}, causing the `target`{attr} attribute to be omitted entirely. As an alternative, we can use `'_self'`{js} instead of `null`{js}, since that's the default value for the `target`{attr} attribute on `<a>`{html} elements.

### Dynamic classes

Let's build on the previous example, and add a dynamic `is-external`{str} class when the `target`{attr} is `"_blank"`{str}. We do this using a `:class+is-external`{attr} expression:

```yz
<title>custom-link</title>
<meta attribute="to" type="string" default="#">
<template mode="closed" delegates-focus="true">
	<a
		:href="$.to"
		:target="$.isExternal ? '_blank' : null"
		:class+is-external="$.isExternal"
	>
		<slot></slot>
	</a>
</template>
<script>
live.link($.$isExternal, () => {
	return !$.to.startsWith('.') && !$.to.startsWith('/');
});
</script>
```

Note that we could just as well use a `:class`{attr} expression here, but that would both be more verbose and less flexible; if we then want to add another class, we'll get either an unnecessarily complex `:class`{attr} attribute, or we need to convert them to individual `:class+`{attr} expressions anyway.

## Usage notes

While it is possible to pass both a non-reactive attribute and a reactive attribute at the same time (like `<element :attribute="$.value" attribute="value">`{yz}), the reactive attribute overwrites any static value already when the component connects. In general, this is advised against, since its behavior might not be obvious. Similarly, it is not advised to combine the `:attribute`{attr} syntax with the `.property`{attr} syntax if they are bound to the same thing; in this case, both will be competing to update the value whenever their live dependencies change, in an unspecified (and therefore unreliable) order.

## See also

- [`.property`](/docs/components/template/properties/)
- [`effect()`](/docs/effect/)
- [`live`](/docs/live/)
- [`live.link()`](/docs/live/link/)
