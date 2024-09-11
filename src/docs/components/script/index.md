---
{
	"title": "<script>",
	"terms": "script section logic component code constructor setup javascript defin top level",
	"description": "A single place to write component logic. Here, define things either for use inside the component template or to be exposed on the custom element."
}
---

The `<script>`{yz} section is executed when a custom element is constructed. In other words, it runs once for every element instance.

## Syntax

```yz
<script>…</script>
```

### Attributes

The `<script>`{yz} tag, when used inside of a component definition file, does not take any attributes. If any are defined, they are ignored; even if they are normally valid on script tags. For example, `type="text/plain"`{attr}, or `defer`{attr}, do nothing, and the `<script>`{yz} is treated as if it does not have any attributes.

### In the script

Inside the component logic, a handful of variables are exposed;

- Most importantly, the component's state variable [`$`](/docs/components/$/). This includes `$.$attributes`{js}, which reflects attributes defined through [`<meta attribute>`](/docs/components/meta/attribute/);
- Lifecycle callbacks, specifically [`connected()`](/docs/components/connected/) and [`disconnected()`](/docs/components/disconnected/), but also any hooks registered with [`<meta hooks>`](/docs/components/meta/hooks/);
- [`query()`](/docs/components/query/), a function for getting references to elements in the template;
- The [`internals`](/docs/components/internals/) variable allows for easy access to the component's `ElementInternals`{js}, useful primarily for grabbing the shadow root and setting internal state for form-associated elements;
- The `this`{js} value is bound to the component instance;
- Lastly, the core functions Yozo provides, such as [`live()`](/docs/live/), [`when()`](/docs/when/), [`monitor()`](/docs/monitor/), [`Flow`](/docs/flow), [`effect()`](/docs/effect/), and all others except for [`register()`](/docs/register/).

The availability of all the above makes it easy to write component logic code with minimal boilerplate.

## Examples

### Component logic

Let's create a simple `custom-greeting`{tag} component that displays a greeting given by the `greeting`{attr} attribute and a name from an input element inside the component. In addition, we'll define a `.setName()`{js} method that overwrites the current input value with the given value.

```yz
<title>custom-greeting</title>
<meta attribute="greeting" type="string" default="Hello">
<meta method="setName">
<template mode="closed">
	<label>
		Name:
		<input type="text">
	</label>
	<div id="message">
		{{ $.greeting }}, {{ $.name }}!
	</div>
</template>
<script>
const input = query('input');
$.name = 'Max';

connected(() => {
	input.value = $.name;
	live.link($.$name, input);
});

$.setName = (name) => {
	$.name = name;
};
</script>
```

Before we step through the different parts of the `<script>`{yz}, note that we define the `greeting`{attr} attribute through [`<meta attribute=…>`](/docs/components/meta/attribute/) and the `.setName()`{js} method using [`<meta method=…>`](/docs/components/meta/method/). Since we provided a type (it's a string), the attribute is reflected by the `.greeting`{js} property and it's bound to the state variable under `$.greeting`{js}. The method is looked up under `$.setName()`{js}, so we'll define that in the `<script>`{yz} section as well.

The `<script>`{yz} section runs when our custom element is constructed, meaning this happens once per created element. In this case, we first get a reference to the `<input>`{yz} element from our template using the [`query()`](/docs/components/query/) helper. Then, we set an initial value for the live variable `$.$name`{js}. Inside the script, we have access to lifecycle callbacks, and in this case we go for [`connected()`](/docs/components/connected/). In theory, we don't need this lifecycle callback, but if we omit it then the component could be doing unnecessary work while disconnected. In general, using `connected()`{js} for things that involve the template is a bit more efficient, so doing it here is moreso about building a habit than about performance benefits (which are minimal in this case). Inside the lifecycle callback, we set the input's value to whatever the live variable `$.$name`{js} contains (this is our source of truth) and then we link the `$.$name`{js} variable to the input using [`live.link()`](/docs/live/link/). This causes the input to always match `$.$name`{js} and vice versa. Note that since we set it up inside the `connected()`{js} callback, this live link will be taken down whenever the component disconnects.

Lastly, we need to define the `.setName()`{js} method. We already declared it in the `<meta method=…>`{yz} tag, so we must define it in our `<script>`{yz}. In this case, the logic is simple; we set `$.name`{js} to the function's argument. Since `$.$name`{js} is a live variable linked to the input, this'll automatically update that as well.

### Imports

Sometimes, a third-party or just seperate script needs to be imported into component logic. Both static `import`{js} statements and top-level `await`{js} are not permitted in `<script>`{yz} sections, since the component logic represents a constructor, which should be synchronous. This is because elements should be available and usable right away when they're created. In other words, the `<script>`{yz} in component definitions is not a `type="module"`{attr} script (and adding that attribute does not turn it into one). However, dynamic `import()`{js} statements work as usual and are the recommended way to load a module into a component.

:::warning
**Warning:** A pitfall of using `import()`{js} statements is when using relative URLs. Since Yozo parses and compiles component definitions client-side, it cannot respect the original URL that your script is located at with regards to relative URLs. In other words, relative URLs are resolved against wherever Yozo's script lives. Similarly, `import.meta.url`{js} always resolves to Yozo's script's location.
:::

So, how does importing work in module scripts? The recommended way is to use a dynamic `import()`{js} to load the external module or script and assign it to a property on the state variable [`$`](/docs/components/$/) once ready. Then, write logic for both the case where that key is not yet defined and for when it is defined. For example:

```yz
<title>db-status</title>
<template mode="closed">
	<div #if="!$.database">loading…</div>
	<div #else>
		{{ $.database.getStatus() }}
	</div>
</template>
<script>
import('/scripts/database.js').then(exports => {
	$.database = exports;
});
</script>
```

An alternative method is to set up an [`effect()`](/docs/effect/) or [`live.link()`](/docs/live/link/) handling both the loading case and the after-loading case:

```yz
<title>db-status</title>
<template mode="closed">
	<div>{{ $.status }}</div>
</template>
<script>
import('/scripts/database.js').then(exports => {
	$.database = exports;
});

live.link($.$status, () => {
	if(!$.database){
		return 'loading…';
	}
	return $.database.getStatus();
});
</script>
```

The dynamic import is called once for every custom element instance, but this is okay; after the script has loaded once, subsequent `import()`{js} statements resolve immediately, as the browser has cached the modules.

## Usage notes

While it is possible to use top-level `return`{js} statements inside the `<script>`{yz} section, this must not be done as it may break in future versions of Yozo.

Inside the `<script>`{yz}, all top-level goodies Yozo provides are available by default without the `yozo.`{js} namespace, with an exception for `register()`{js}. This exception exists mainly because it is somewhat vaguely named without the `yozo`{js} namespace, and this is also consistent with what happens when assigning all Yozo helpers to the global scope (through `Object.assign(window, yozo)`{js}), where `register`{js} is also excluded. Either way, it is not generally advised to register components from the constructor of other components; if a certain component is needed in another, load them both at the same time for better performance. The non-namespaced Yozo helpers available inside the `<script>`{yz} should not (and cannot) be overwritten.

## See also

- [`$`](/docs/components/$/)
- [`query()`](/docs/components/query/)
- [`connected()`](/docs/components/connected/)
- [`disconnected()`](/docs/components/disconnected/)
- [`internals`](/docs/components/internals/)
- [`<meta>`](/docs/components/meta/)
- [`<template>`](/docs/components/template/)
