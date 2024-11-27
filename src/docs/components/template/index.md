---
{
	"title": "<template>",
	"terms": "template section dom node element component markup attach shadow root mode open closed delegates focus slot assigment style script",
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

Yozo reuses the native `<template>`{html} element to define a component template. However, its attributes in (the top level of) a Yozo component file are different from its native attributes.

As a top-level element in a Yozo component file, it describes markup for a component. Without attributes, the markup will be placed inside (i.e. as direct children of) the element upon connecting to the DOM for the first time, removing any children it might have gotten before connecting. In fact, it cannot have slots, either; the native `<slot>`{yz} element is not allowed in templates without shadow root. This is because slots take an element's direct child nodes, whereas shadowless components render their template as children, making it impossible to retroactively assign elements to slots. Lastly, when using templates without shadow root, styles defined inside the [`<style>`](/docs/components/style/) element are _not_ scoped.

:::info
**Note:** When the `mode`{attr} attribute is used, the attributes directly convert to the options passed to the underlying `.attachShadow()`{js} call. For more information about shadow roots, see [.attachShadow() on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).
:::

`mode`{attr} <mark>optional</mark>
: If provided, a shadow root is created with this as the `mode`{js} option. Specifically, this is either `"open"`{str} or `"closed"`{str}. Using an open shadow root means the shadow root is exposed through the `.shadowRoot`{js} property (this is native behavior). As such, closed shadow roots are recommended for better encapsulation. Note that using shadow roots makes [`<style>`](/docs/components/style/) elements scoped.

`delegates-focus`{attr} <mark>optional</mark>
: Equivalent to the `delegatesFocus`{js} option in the options provided to `.attachShadow()`{js}. The only valid value for this attribute is `"true"`{str}; leave out the attribute altogether if delegating focus is not desired.

`slot-assignment`{attr} <mark>optional</mark>
: Equivalent to the `slotAssignment`{js} option in the options provided to `.attachShadow()`{js}. Valid values are `"named"`{str} (default) and `"manual"`{str}, determining whether slotted elements are automatically placed by their name (for `"named"`{str}) or whether slotted elements should manually be placed using `HTMLSlotElement.assign()`{js}.

### Inside the template

The template is almost always one of the most important aspects of a component. As such, a handful of useful features exist inside the template. For those familiar with popular frameworks or component-based libraries, these probably come as no surprise:

- [`#if`](/docs/components/template/if-else) statements (with `#else-if`{attr} and `#else`{attr}), as attributes, for conditional elements.
- [`#for…of`](/docs/components/template/for-of/) loops, as an attribute, for generating a list of elements from an array (or other type of iterable).
- [`{{ inline }}`](/docs/components/template/inline/) expressions, for texual interpolation (only in text nodes).
- [`:attribute`](/docs/components/template/attributes/) expressions that reactively evaluate their value as JavaScript. Additionally, there is special syntax available for toggling individual classes through `:class+name`{attr}.
- [`.property`](/docs/components/template/properties/) expressions that reactively set properties of elements. Also supports nested properties (e.g. `.style.font-size=…`{attr}).
- [`@event`](/docs/components/template/events/) expressions, to attach event listeners inline. The listeners connect and disconnect together with the component.

## Examples

### FizzBuzz

FizzBuzz is a classic programming task where one is asked write a program that outputs the numbers `1`{js} through `N`{js}, but every number divisible by `3`{js} is replaced by `Fizz`{str}, every number divisible by `5`{js} by `Buzz`{str}, and every number divisible by both is replaced by `FizzBuzz`{str}. For this component, we'll do the same; we'll have buttons to increase or decrease the maximum number `N`{js}, and output each number (including `Fizz`{str}es and `Buzz`{str}es) dynamically. Note that this component could be made more efficiently (both in terms of brevity as well as runtime performance) but it is a fictional component to demonstrate template features.

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

### Shadow or no shadow

:::info
**Note:** for those unfamiliar with shadow roots, see "[What is shadow DOM?](/blog/what-is-shadow-dom/)" on Yozo's blog!
:::

An important question to ask before starting to build any component is; should it have a shadow root? Usually, the answer to this question wildly depends on not only on the component in question but also on the tools chosen to build the site. For example, when using a class-based CSS library such as [Tailwind CSS](https://tailwindcss.com/), usually shadow roots are undesirable because it prevents styles (including the class definitions) from seeping into components. When writing CSS in the [`<style>`](/docs/components/style/) block within the component definition however, often times a shadow root is a nice way to keep component-related styles separate from the overarching page. This has maintenance benefits, but also load-time performance benefits because component styles are only ever loaded when the whole component is.

In general, the choice boils down to the amount of encapsulation needed. Custom elements without a shadow root have essentially no encapsulation whatsoever; those with closed shadows are shielded from effectively any outside access both style-wise and script-wise. Open shadows land right in the middle, allowing _some_ access through JavaScript, but maintaining the style encapsulation.

## See also

- [What is shadow DOM?](/blog/what-is-shadow-dom/)
- [Using shadow DOM on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
