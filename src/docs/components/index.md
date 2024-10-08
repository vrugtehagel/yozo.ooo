---
{
	"title": "Components",
	"terms": "web components custom element defin yozo title meta template script style",
	"description": "Write reusable web components, in a structured, straight-foward format, with features ranging from inline template logic to fine-grained reactivity."
}
---

## Anatomy

Yozo's main attraction is components. Essentially, Yozo provides a much more streamlined way to write native web components. It features shadow roots, templates, scoped styles, hooks, simple ways to add attributes, methods, or properties, and more!

So, let's dive into the anatomy of a Yozo component. First of all, each component should be written in its own file. Generally, it is recommended to use a `.yz`{url} extension, so it is easy for developers to recognize the files. Then, configure your editor to highlight `.yz`{url} files as HTML. However, the function responsible for parsing the files, [`register()`](/docs/register/), is not picky about the extension; it will try to read any file it receives regardless of extension. Since the format is HTML-like, if configuring syntax highlighting for `.yz`{url} files is a problem, the next-best option would be to use `.html`{url}.

### Metadata

The first thing in a component file is the [`<title>`](/docs/components/title/). This tag describes the name of the component. In general, it's recommended to align the file name with the component name (for better synergy with [`register.auto()`](/docs/register/auto/) as well as maintainability), but this is an entirely optional convention. After having defined the name, [`<meta>`](/docs/components/meta/) tags follow, defining the exposed API for the component in question. This includes [attributes](/docs/components/meta/attribute/), [properties](/docs/components/meta/property/), [methods](/docs/components/meta/method/) and whether or not the component is [form-associated](/docs/components/meta/form-associated/). The meta tags are not only self-documentating, Yozo also uses them to construct and expose said API on the custom element. For example, we might define:

```yz
<title>space-ship</title>
<meta attribute="speed" type="number">
<meta attribute="haspilot" as="hasPilot" type="boolean">
<meta method="accelerate">
```

In this example, our custom element is called `<space-ship>`{html}, has two attributes `speed`{attr} and `haspilot`{attr}, with associated `.speed`{js} and `.hasPilot`{js} properties respectively, and finally an `.accelerate()`{js} method. The latter must be defined in the [`<script>`](/docs/script/) section. For more information on configuration options, see [`<meta>`](/docs/components/meta/).

### The template

Next up is the [template](/docs/components/template/). Yozo allows both shadow roots as well as shadow-less components. For encapsulation, shadow roots are recommended. In some cases, like when working with a class-based CSS library or framework, shadow-less components would be preferred. An example of a template could be:

```yz
<template mode="closed">
	Click the button:
	<button @click="$.onclick()">
		{{ $.label }}
	</button>
</template>
```

The shadow root's configuration is passed through the `<template>`{yz}'s attributes, and the template's body is put into the shadow root. When using shadow-less components, leave out the `<template>`{yz}'s attributes, and the template's content will be inserted once the component connects to the DOM. Inside the template, there are a variety of helpful shorthands to add some life to the components, ranging from basic things like an [`{{ inline }}`](/docs/components/template/inline/) expression, to [conditions](/docs/components/template/if-else/), to [event listeners](/docs/components/template/events/) and of course [reactive attributes](/docs/components/template/attributes/) and [properties](/docs/components/template/properties/). For more detailed explanations on the template syntax, see [`<template>`](/docs/components/template/).

### Logic

Component logic is written inside a [`<script>`](/docs/components/script/) tag. Inside this `<script>`{yz} tag, there are a few "magically" imported variables. First and foremost, most of Yozo's helpers (such as [`when()`](/docs/when/), [`effect()`](/docs/effect/), and more). The [`connected()`](/docs/components/connected/) and [`disconnected()`](/docs/components/disconnected/) hooks are also directly available, and represent the native `connectedCallback()` and `disconnectedCallback()` that custom elements have. Then there is a function [`query()`](/docs/components/query/) for a straight-foward way to access the elements in your template, and [`internals`](/docs/components/internals/) to access the native `ElementInternals`{js} for the element. And last, but not least, there is [`$`](/docs/components/$/); the state object tied to the component instance. Some of the properties on the `$`{js} object are exposed by the custom element itself, but only if described so in the metadata. For example, defining a function `$.doThing()`{js} itself will allow it to be used inside the template, but not expose it to the "outside" (i.e. `myComponent.doThing`{js} remains `undefined`{js}). However, adding `<meta method="doThing">`{yz} subsequently exposes it, and `myComponent.doThing`{js} suddenly is defined. For an in-depth look at what's possible in `<script>`{yz} sections, see [`<script>`](/docs/components/script/).

### Styles

Writing component styles in Yozo components is much like writing styles in a regular HTML document. The [`<style>`](/docs/components/style/) tag is used to write CSS into. Whether or not the styles are scoped depends on whether a shadow root has been specified (on the component's `<template>`{yz} element). If that's the case, then web component related CSS selectors such as `:host`{sel} can be used; if there is no shadow root, then the styles written there are "global", i.e. apply to any context the element is used in. For a complete description on component styles, see [`<style>`](/docs/components/style/).

## Examples

To demonstrate the power of Yozo components, we'll have a look at some variations of a basic `click-counter`{tag} component; a component that renders a single button, and counts the amount of times it's being clicked.

### Reccommended

First, we'll go through the recommended way of approaching this component:

```yz
<title>click-counter</title>
<meta attribute="amount" type="number">
<meta method="reset">

<template mode="closed">
	<button @click="$.amount++">
		{{ $.amount }} clicks
	</button>
</template>
<script>
$.reset = () => $.amount = 0;
</script>
<style>
:host {
	display: block;
}
button {
	padding: .75rem 1.5rem;
	cursor: pointer;
}
</style>
```

Just by looking at the metadata in the first three lines of the component, we know how to use it; it's called `<click-counter>`{html}, it has one attribute (the `amount`{attr} attribute) which represents a number, as well as a `.reset()`{js} method.

Diving into the actual component structure, we see it has a closed shadow root (from `mode="closed"`{attr}), with a single element in its template, a `<button>`{yz}. Upon clicking the button (`@click`{attr}), the `.amount`{js} property is incremented. This property is a number, as specified, and reactively tied to the attribute, meaning the attribute says in sync with the property at all times. Inside the button, we render the amount of clicks as text. Next up, at the script section, we define the `.reset()`{js} method, which is exposed to the outside through being defined in a `<meta>`{yz} tag. Lastly, there's some (scoped) styling. The `:host`{sel} selector is a web components feature; inside a shadow root, it refers to the shadow host; in this case, the `<click-counter>`{html} element itself.

### Manual updates

As an additional excercise, let's write the same component with a static template. Then, we'll add the interactivity manually in the `<script>`{yz}. For brevity, the styles are left out (they would be identical to the previous example).

```yz
<title>click-counter</title>
<meta attribute="amount" type="number">
<meta method="reset">

<template mode="closed">
	<button>0 clicks</button>
</template>
<script>
const button = query('button');

$.reset = () => $.amount = 0;

connected(() => {
	when(button).clicks().then(() => {
		$.amount++;
	});
});

connected(() => {
	effect(() => {
		button.textContent = `${ $.amount } clicks`;
	});
});
</script>
```

The template has been simplified to its bare bones, only containing a simple button and some placeholder text. First, we get a reference to the button through the [`query()`](/docs/components/query/) function.

Then, to replace the `@click`{attr} expression, we set up the first [`connected()`](/docs/components/connected/) hook. Only when the component is connected do we want this click handler set up (and this is what `@click`{attr} does, internally, too). To set up the handler, we use [`when()`](/docs/when/), since it is monitored and therefore is taken down by the `connected()`{js} hook whenever the component disconnects. If we'd have used `.addEventListener()`{js}, then repeatedly connecting (and disconnecting) the custom element would set up additional listeners, without ever taking older ones down.

For the `{{ $.amount }}`{yz} expression, we'll set up an [`effect()`](/docs/effect/), since they allow us to describe an update with implicit dependencies. In this case, we simply set the button's `.textContent`{js} to the correct expression. The effect sees that the `$.amount`{js} variable is being accessed, and therefore re-runs the effect whenever `$.amount`{js} changes. Since there's not much of a point to updating the text for disconnected components, we wrap the `effect()`{js} with another `connected()`{js} hook. Since effects, much like the `when()`{js} call, are monitored, the connected callback takes it down whenever the custom element disconnects.

## See also

- [`register()`](/docs/register/)
- [`<title>`](/docs/components/title/)
- [`<meta>`](/docs/components/meta/)
- [`<template>`](/docs/components/template/)
- [`<script>`](/docs/components/script/)
- [`<style>`](/docs/components/style/)
