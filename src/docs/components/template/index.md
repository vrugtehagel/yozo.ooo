---
{
	"layout": "layouts/docs.liquid",
	"title": "<template>",
	"description": "Write simple, descriptive markup for components, optionally with a shadow root, using inline logic and straight-forward shorthands."
}
---

## Syntax

```yz
<template>…</template>
<template mode="…">…</template>
<template mode="…" delegates-focus="…">…</template>
<template mode="…" slot-assignment="…">…</template>
```

### Attributes

Yozo reuses the native `html`<template>`` element. Its usual attributes are different from its attributes in (the top level of) a Yozo component file.

As a top-level element in a Yozo component file, it describes markup for a component. Without attributes, the markup will be placed inside (i.e. as direct children of) the element upon connecting to the DOM for the first time, removing any children it might have gotten before connecting. When using templates without shadow root, styles defined inside the [`<style>`](/docs/components/style/) element are _not_ scoped.

:::info
**Note:** When the `attr`mode`` attribute is used, the attributes directly convert to the options passed to the underlying `js`.attachShadow()`` call. For more information about shadow roots, see [.attachShadow() on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).
:::

`attr`mode`` <mark>optional</mark>
: If provided, a shadow root is created with this as the `js`mode`` option. Specifically, this is either `str`"open"`` or `str`"closed"``. Using an open shadow root means the shadow root is exposed through the `js`.shadowRoot`` property (this is native behavior). As such, closed shadow roots are recommended for better encapsulation. Note that using shadow roots makes [`<style>`](/docs/components/style/) elements scoped.

`attr`delegates-focus`` <mark>optional</mark>
: Equivalent to the `js`delegatesFocus`` option in the options provided to `js`.attachShadow()``. The only valid value for this attribute is `str`"true"``; leave out the attribute altogether if delegating focus is not desired.

`attr`slot-assignment`` <mark>optional</mark>
: Equivalent to the `js`slotAssignment`` option in the options provided to `js`.attachShadow()``. Valid values are `str`"named"`` (default) and `str`"manual"``, determining whether slotted elements are automatically placed by their name (for `str`"named"``) or whether slotted elements should manually be placed using `js`HTMLSlotElement.assign()``.

### Inside the template

The template is almost always one of the most important aspects of a component. As such, a handful of useful features exist inside the template. For those familiar with other frameworks, these probably come as no surprise:

- [`#if`](/docs/components/template/if-else) statements (with `attr`#else-if`` and `attr`#else``), as attributes, for conditional elements.
- [`#for…of`](/docs/components/template/for-of/) loops, as an attribute, for generating a list of elements from an array (or other type of iterable).
- [`{{ inline }}`](/docs/components/template/inline/) expressions, for texual interpolation (only in text nodes).
- [`:attribute`](/docs/components/template/attributes/) expressions that reactively evaluate their value as JavaScript.
- [`.property`](/docs/components/template/properties/) expressions that reactively set properties of elements. Also supports nested properties (e.g. `attr`.style.font-size=…``) and has special syntax for `js`DOMTokenList`` properties (most notably `js`.classList``) through, for example, `attr`.class-list.classname=…``.
- [`@event`](/docs/components/template/events/) expressions, to attach event listeners inline. The listeners connect and disconnect together with the component.

## Examples

### FizzBuzz

FizzBuzz is a classic programming task where one is asked write a program that outputs the numbers `js`1`` through `js`N``, but every number divisible by `js`3`` is replaced by `str`Fizz``, every number divisible by `js`5`` by `str`Buzz``, and every number divisible by both is replaced by `str`FizzBuzz``. For this component, we'll do the same; we'll have buttons to increase or decrease the maximum number `js`N``, and output each number (including `str`Fizz``es and `str`Buzz``es) dynamically. Note that this component could be made more efficiently (both in terms of brevity as well as runtime performance) but it is a fictional component to demonstrate template features.

```yz
<title>fizz-buzz</title>
<meta attribute="max" type="number">
<template mode="closed">
	<button @click="$.max--">Decrease maximum</button>
	<button @click="$.max++">Increase maximum</button>
	<output>
		<span #for="number of $.numbers">
			<template #if="number % 15 == 0">
				FizzBuzz
			</template>
			<template #else-if="number % 5 == 0">
				Buzz
			</template>
			<template #else-if="number % 3 == 0">
				Fizz
			</template>
			<template #else>
				{{ number }}
			</template>
		</span>
	</output>
</template>
<script>
live.link($.$numbers, () => {
	return Array.from({ length: $.max })
		.map((value, index) => index + 1);
});
</script>
<style>
:host {
	display: block;
}
output {
	display: block;
	margin: 1rem 0;
}
</style>
```

## See also

- [Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
