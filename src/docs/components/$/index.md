---
{
	"title": "Component state: $",
	"terms": "component state $ dollar live variable data react",
	"description": "Each component gets a live state variable named `$`{js}. This variable allows for fine-grained reactivity in a concise manner."
}
---

:::info
**Note:** Not yet comfortable with live variables? See [`live()`](/docs/live/) first to learn more!
:::

The [live](/docs/live/) variable is used both for internal logic as well as exposing properties and methods on the custom element. It is available in a component's `<script>`{yz} section as well as inside inline expressions in component's `<template>`{yz}.

## Syntax

```js
$.property;
$.method();
$.$attributes.name;
$.$other.$custom.properties;
```

## Details

The [live](/docs/live/) component state variable `$`{js} is crucial in writing components with Yozo. It is created once for each component instance, giving authors full control over internal component state. Its reactivity powers properties, attributes, methods, and other logic, such as [`{{ inline }}`](/docs/components/template/inline/) expressions, [`#for`](/docs/components/template/for-of/) loops and more. It is also the primary (and only) way to share data between a component's [`<script>`](/docs/components/script/) and its [`<template>`](/docs/components/template/). The following properties on `$`{js} are automatically created or looked for:

- `$.attributes`{js} is an object representing the component's attributes, which are declared with [`<meta attribute>`](/docs/components/meta/attribute/). If none are defined, then this is an empty object. For each attribute, a nested key with matching name (converted to camelCase) is created on said object. For example; declaring an attribute `button-text`{attr} on a component creates the property `$.$attributes.buttonText`{js}.
- Each property defined with [`<meta property>`](/docs/components/meta/property/) is looked up under the given key in `$`{js} and then exposed on the custom element in question. This opens up a reactive API for properties that are traditionally just getters and setters.
- If an attribute declared through `<meta attribute>`{yz} has a given `type`{attr}, then an accompanying property is created. Unless overwritten with the `as`{attr} option, the property is a camelCase-transformed version of the attribute name. This property is reflected on `$`{js} as well as on the custom element itself.
- Each method defined through [`<meta method>`](/docs/components/meta/method/) is looked up under `$`{js}. If declared, the property must be set to a function (usually done in the [`<script>`](/docs/components/script/) section).

Of course, other properties beyond these may be set (including binding data with [`live.link()`](/docs/live/link/) at any point to retain any arbitrary live data and to share it with the `<template>`{yz}, where expressions always include `$`{js} into their scope.

## Examples

### Markdown editor

Let's say we have a function `md.render()`{js} that takes a string of Markdown as input, and outputs HTML (as a string). We'll build a component that lets a used enter some Markdown-formatted text into a `<textarea>`{yz}, and it'll display the output below. To do this, we'll first need to import the `md`{js} variable into our component (we'll put it in `$.md`{js}) using a dynamic `import()`{js}, and in the mean time we should show a loader. Next, we link `$.input`{js} to the value in the `textarea`{tag} using [`live.link()`](/docs/live/link/), and lastly set up an [`effect()`](/docs/effect/) to render the output.

```yz
<title>markdown-editor</title>
<template>
	<div #if="!$.md">
		loading…
	</div>
	<template #else>
		<textarea></textarea>
		<div id="output"></div>
	</template>
</template>
<script>
live.link($.$input, textarea);

import('./md.js').then(({ md }) => $.md = md);

const output = query('#output');
connected(() => {
	effect(() => {
		if(!$.md) return;
		output.innerHTML = $.md.render($.input);
	});
});
</script>
```

At first, `$.md`{js} is `undefined`{js}, causing the loader to be show, and the effect has an early `return`{js} for when the imported module is not yet ready. Once it becomes available, the effect re-runs and uses the value of `$.input`{js}, which has been bound to the `textarea`{tag} to render the Markdown. Since `$.input`{js} is linked, it reactively updates based on changes in the textarea.

### Animal sounds

For this example, we'll build a component that receives an animal in an `animal`{attr} attribute, and displays the noise (such as "meow") that animals makes. We'll have a boolean `loud`{attr} attribute, which causes the noise to be displayed in all-caps. Additionally, we'll expose an `.alert()`{js} method on the element, and a read-only property `.isMammal`{js}. Our component definition might look something like

```yz
<title>animal-sound</title>
<meta attribute="animal" type="string" default="cat">
<meta attribute="loud" type="boolean">
<meta method="alert">
<meta property="isMammal" readonly>
<template>
	{{ $.loud ? $.noise.toUpperCase() : $.noise }}
</template>
<script>
const animals = {
	cat: { noise: 'meow', isMammal: true },
	dog: { noise: 'woof', isMammal: true },
	fish: { noise: 'blub', isMammal: false },
	frog: { noise: 'croak', isMammal: false },
};

live.link($.$data, () => animals[$.animal]);
live.link($.$noise, () => $.data?.noise ?? '');
live.link($.$isMammal, () => $.data?.isMammal ?? false);

$.alert = () => {
	window.alert($.loud ? $.noise.toUpperCase() : $.noise);
}
</script>
```

Let's go through what's happening here, starting from the `<script>`{js}. First, we define some data; this is our small database of sorts, and includes all the animals we want to support with the `animal`{attr} attribute. Next, we bind the relevant data from said database to the `$.data`{js} variable. This stays up-to-date; if the component's `.animal`{js} property or `animal`{attr} attribute changes, then `$.data`{js} updates with it. This allows us to just read `$.data`{js} from here on out instead of having to worry about which `animal`{attr} we need to use. As such, we can define `$.noise`{js} and `$.isMammal`{js} just from reading `$.data`{js}. The latter is exposed to the custom element because we defined it through `<meta property=…>`{yz}. The former, `$.noise`{js} is used only internally. Lastly, we define the `$.alert()`{js} method, since we declared it using `<meta method=…>`{yz}. This means our custom element gets that `.alert()`{js} method as well. Inside the `<template>`{yz}, similar to the logic in the `.alert()`{js} method, we check if we need to use uppercase or not and display the animal sound.

## See also

- [`live()`](/docs/live/)
- [`live.link()`](/docs/live/link/)
- [`effect()`](/docs/effect/)
- [`<meta attribute>`](/docs/components/meta/attribute/)
- [`<meta property>`](/docs/components/meta/property/)
- [`<meta method>`](/docs/components/meta/method/)
