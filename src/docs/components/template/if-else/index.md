---
{
	"layout": "layouts/docs.liquid",
	"title": "#if - #else",
	"description": "Use the `#if`{attr}, `#else-if`{attr} and `#else`{attr} attributes to conditionally render elements based on a series of conditions, right from inside the `<template>`{html}."
}
---

## Syntax

```yz
<element-1 #if="condition1"></element-1>
<element-2 #else-if="condition2"></element-2>
<!-- … -->
<element-n #else></element-n>
```

### Parameters

`condition`{js}
: A condition for whether or not to render the element in question (including its subtree). Usually, the expression has live dependencies, and the element is added or removed reactively depending on the reactive value of the `condition`{js}. The `#else`{attr} attribute does not accept a `condition`{js}.

## Details

The chain of `#if`{attr}, `#else-if`{attr} and `#else`{attr} must be defined on a series of adjacent sibling elements. Any non-element nodes in between these elements are removed. Additionally, like [`#for`](/docs/components/template/for-of/), when any of the control flow attributes are placed on a `<template>`{html} element, the children are rendered, and the `<template>`{html} element itself is omitted. This allows for conditionally rendering groups of elements or individual non-element nodes instead of a chain of individual elements.

Like in JavaScript, the conditions inside `#if`{attr} and `#else-if`{attr} may not include statements. They must be expressions. In other words; semicolons are not permitted in the conditions.

Lastly, elements are created and removed in an [`effect()`](/docs/effect/) under the hood. None of the elements in the chain are available at the time of construction, making it impossible to top-level `query()`{js} any of them. Additionally, elements are recreated, not reused; if the element with the `#if`{attr} attribute renders first, then gets removed, and re-rendered again, then the latter is a different DOM node than the originally rendered one. Holding references to these elements is therefore not a good idea; they change over time. If a reference is needed, re-query the necessary elements with [`query()`](/docs/components/query/). This also means that in cases where your reactive if-else chain changes its conditions quickly or frequently, it may be more performant to render them conditionally using dynamic `hidden`{attr} attributes on each of the elements (using the [`.property`](/docs/components/template/properties/) syntax).

## Examples

### Loading

When using external resources in the rendering of a component, we often have a moment where the resource is not yet ready, but the component must render something. In cases like these, a simple `#if`{attr}-`#else`{attr} is perfect:

```yz
<title>current-balance</title>
<template mode="closed">
	<div #if="!$.loaded">
		loading…
	</div>
	<div #else>
		{{ $.balance }}
	</div>
</template>
<script>
$.loaded = false;

connected(async () => {
	const response = await until(fetch('/wallet.json'));
	const wallet = await until(response.json());
	$.balance = wallet.balance;
	$.loaded = true;
});
</script>
```

Note that we can swap out the `<div>`{yz} elements for `<template>`{yz} elements if we wanted to render text only.

### Link-button

The button element and link (anchor) element overlap visually in many design systems. From a developer's perspective this is somewhat awkward, because it means we cannot style buttons and links based on what they are; at least, not without additional classes. One possible solution to this problem is to have a `ui-button`{tag} component that can render either, depending on whether or not there is an `href`{attr} attribute present:

```yz
<title>ui-button</title>
<meta attribute="href" type="string">
<template mode="closed" delegates-focus="true">
	<a #if="$.href" :href="$.href">
		<slot></slot>
	</a>
	<button #else>
		<slot></slot>
	</button>
</template>
<style>
:host {
	display: inline-block;
	border-radius: .2em;
	color: black;
	background-color: skyblue;
}
button, a {
	display: inline-block;
	padding: .75rem 1rem;
	box-sizing: border-box;
	color: inherit;
	background: none;
	border: none;
	border-radius: inherit;
	font-size: inherit;
	line-height: inherit;
	font-family: inherit;
	text-decoration: none;
	cursor: pointer;
}
</style>
```

Now, we can treat use the `<ui-button>`{html} custom element in cases where the design requires a button-like component, regardless of whether or not it is a link. This keeps our markup semantic and easy to deal with.

### #if versus hidden

When an element has to pop in and out of the DOM often, or must be animated, it can sometimes be more performant to use the `hidden`{attr} attribute instead of an `#if`{attr}. For example, we might implement a custom version of the native `<detail>`{html} element like so:

```yz
<title>custom-detail</title>
<meta attribute="summary" type="string">
<meta attribute="open" type="boolean">
<meta method="toggle">
<template mode="closed">
	<div id="details">
		<div id="summary" @click="$.toggle()">
			{{ $.open ? '▼' : '►' }}
			{{ $.summary }}
		</div>
		<div id="content" .hidden="!$.open">
			<slot></slot>
		</div>
	</div>
</template>
<script>
$.toggle = force => {
	$.open = force ?? !$.open;
}
</script>
```

In this example, not only can the `.hidden`{attr} attribute be exchanged for an `#if`{attr}, but the ternary determining the arrow in the template as well. The former however doesn't gain anything from using `#if`{attr} over `.hidden`{attr}, and would just be heavier choice overall; it is toggling a boolean property on an element versus removing and recreating multiple DOM nodes. The latter, the arrow, would only become more verbose with the use of `#if`{attr}, since it would require two `<template>`{yz} elements (one around each arrow).

As a rule of thumb; use `#if`{attr} - `#else`{attr} only if either the condition is expected to rarely change, or if the absence or presence of an element is necessary. Otherwise, the `.hidden`{attr} attribute (or equivalent, such as classes or inline styles) will most likely be a simpler and more performant choice.

## See also

- [`<template>`](/docs/components/template/for-of/)
- [`#for`](/docs/components/template/for-of/)
- [`.properties`](/docs/components/template/properties/)
- [components](/docs/components/)
