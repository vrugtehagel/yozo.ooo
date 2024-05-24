---
{
	"layout": "layouts/docs.liquid",
	"title": "<style>",
	"description": "Use a `<style>`{yz} block to define component styles. They can be scoped or non-scoped, depending on whether or not the component has a shadow root."
}
---

## Syntax

```yz
<style>…</style>
```

### Attributes

The `<style>`{yz} tag, when used inside of a component definition file, does not take any attributes. If they are defined, they are ignored; even if they are normally valid on `<style>`{yz} tags.

### Inside the style tag

No special syntax is defined for the CSS in the `<style>`{yz} block.

If the component is not using a shadow root, then the stylesheet is used as-is and added to the document. If a component without shadow root is added to another component's shadow root (meaning document styles do not affect it), then the stylesheet defined is added to the nearest shadow root. In other words, a shadowless component adds its styles to whichever root (document or shadow root) it is added.

If the component has a shadow root (regardless of its mode), then the component's styles are scoped. They also get access to a variety of native features specific to web components, such as `:host`{sel} or `::slotted()`{sel}. Generally, scoped styles are a more robust option for a library of web components, since it more encapsulated and therefore less reliant on the environment they are used in. Furthermore, they provide more granular styling options to component users, through `::part()`{sel} and CSS variables, and allow for children with the native `<slot>`{yz} element. Usually, shadow roots leads to more flexibility for component library authors, since users are less directly dependent on the internal structure of a component.

## Examples

### Scoped styles

To make our styles scoped, we need to use a shadow root for our component. We do this using the `mode`{attr} attribute on the [`<template>`](/docs/components/template/) element. In this example, we'll go for a `"closed"`{str} shadow root, to provide maximum encapsulation and avoid component users from meddling with our component's markup.

For this example, let's build a very simple dropdown element. The element accepts content, which is used inside the dropdown, a `label`{attr} attribute to display in the dropdown trigger, and an `open`{attr} attribute that indicates whether or not the dropdown has been opened.

```yz
<title>drop-down</title>
<meta attribute="label" type="string">
<meta attribute="open" type="boolean">
<template mode="closed">
	<button part="button" @click="$.open = !$.open">
		{{ $.label }}
	</button>
	<div id="menu" part="dropdown" .hidden="!$.open">
		<slot></slot>
	</div>
</template>
<style>
:host {
	--dropdown-bg-color: white;
	display: inline-block;
	position: relative;
}
#menu {
	display: flex;
	flex-direction: column;
	position: absolute;
	inset: 100% auto auto 0;
	z-index: 23;
	background-color: var(--dropdown-bg-color);
	&[hidden]{
		display: none;
	}
}
</style>
```

Component users can now target certain parts of this component, such as `::part(button)`{sel} to select the dropdown button, or using the (somewhat redundant) `--dropdown-bg-color`{css} variable to adjust the dropdown's background color. If we, as component author, now decide we actually need a container for it all (for example, to prevent a user from changing the `position`{css} property on the host element), then we can do so relatively safely because we know that the users of our component are not (can not be) strictly dependent on our component's internal markup structure.

### Shadowless components

When using Yozo in combination with a CSS library or framework such as Tailwind, it is often easiest to avoid shadow roots since global styles can not affect elements inside shadow roots. In this case, generally, we would want to avoid using `<style>`{yz} blocks altogether (since we style with classes), but in some cases it can be helpful to still add styles to a certain component. The defined component styles are then global, so it important to consider the style block as such; it is recommended to control the level of style leaking at least somewhat through e.g. prefixing selectors with the component name (`my-component > …`{sel}), using native scoping (through `@scope`{sel}), or other methods.

To demonstrate, let's write a simple text scroller component. It contains some (long) text as its content, which is displayed on a single line. If it overflows, it automatically scrolls periodically. The component is using library styles, but we'll be adding the animation using a custom style block:

```yz
<title>text-scroller</title>
<template>
	<div class="overflow-x-hidden bg-gray-100">
		<div class="text-scroller-images relative left-0
			w-max min-w-full flex flex-row justify-start
			gap-10 p-10 whitespace-nowrap"
		>
			There is a long line of text here, which never
			wraps. If it overflows, then it scrolls
			horizontally over the duration of 10 seconds,
			so that the entire line is readable.
		</div>
	</div>
</template>
<style>
text-scroller .text-scroller-images {
	animation: text-scroller 10s linear infinite;
}
@keyframes text-scroller {
	0%, 20% {
		translate: 0 0;
		left: 0;
	}
	80%, 100% {
		translate: -100% 0;
		left: 100%;
	}
}
</style>
```

When using nested shadowless components, the DOM tree is entirely non-scoped, which means styles from any component may leak into any other. It is advised to namespace classes or otherwise introduce a system to avoid classes from accidentally being used multiple times in different contexts.

## See also

- [`<template>`](/docs/components/template/)
- [`:host`](https://developer.mozilla.org/en-US/docs/Web/CSS/:host)
- [`::slotted()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted)
- [Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
