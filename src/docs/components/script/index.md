---
{
	"layout": "layouts/docs.liquid",
	"title": "<script>",
	"description": "A single place to write component logic. Here, define things either for use inside the component template or to be exposed on the custom element."
}
---

The `yz`<script>`` section is executed when a custom element is constructed. In other words, it runs once for every element instance.

## Syntax

```yz
<script>…</script>
```

### Attributes

The script tag, when used inside of a component definition file, does not take any attributes. If any are defined, they are ignored; even if they are normally valid on script tags. For example, `attr`type="text/plain"``, or `attr`defer``, do nothing, and the `yz`<script>`` is treated as if it does not have any attributes.

### In the script
Inside the component logic, a handful of variables are exposed;

- Most importantly, the component's state variable [`$`](/docs/components/$/). This includes `js`$.$attributes``, which reflects attributes defined through [`<meta attribute>`](/docs/components/meta/attribute/);
- Lifecycle callbacks, specifically [`connected()`](/docs/components/connected/) and [`disconnected()`](/docs/components/disconnected/), but also any hooks registered with [`<meta hooks>`](/docs/components/meta/hooks/);
- [`query()`](/docs/components/query/), a function for getting references to elements in the template;
- The `js`this`` value is bound to the component instance;
- Lastly, the core functions Yozo provides, such as [`live()`](/docs/live/), [`when()`](/docs/when/), [`monitor()`](/docs/monitor/), [`Flow`](/docs/flow), [`effect()`](/docs/effect/), and all others except for [`register()`](/docs/register/).

The availability of all the above makes it easy to write component logic code with minimal boilerplate.

## Examples

### A custom-greeting component

Let's create a simple `tag`custom-greeting`` component that displays a greeting given by the `attr`greeting`` attribute and a name from an input element inside the component. In addition, we'll define a `js`.setName()`` method that overwrites the current input value with the given value.

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
-velink($.$name, input);
});

$.setName = (name) => {
	$.name = name;
};
</script>
```

Before we step through the different parts of the `yz`<script>``, note that we define the `attr`greeting`` attribute through [`<meta attribute=…>`](/docs/components/meta/attribute/) and the `js`.setName()`` method using [`<meta method=…>`](/docs/components/meta/method/). Since we provided a type (it's a string), the attribute is reflected by the `js`.greeting`` property and it's bound to the state variable under `js`$.greeting``. The method is looked up under `js`$.setName()``, so we'll define that in the `yz`<script>`` section as well.

The `yz`<script>`` section runs when our custom element is constructed, meaning this happens once per created element. In this case, we first get a reference to the `yz`<input>`` element from our template using the [`query()`](/docs/components/query/) helper. Then, we set an initial value for the live variable `js`$.$name``. Inside the script, we have access to lifecycle callbacks, and in this case we go for [`connected()`](/docs/components/connected/). In theory, we don't need this lifecycle callback, but if we omit it then the component could be doing unnecessary work while disconnected. In general, using `js`connected()`` for things that involve the template is a bit more efficient, so doing it here is moreso about building a habit than about performance benefits (which are minimal in this case). Inside the lifecycle callback, we set the input's value to whatever the live variable `js`$.$name`` contains (this is our source of truth) and then we link the `js`$.$name`` variable to the input using [`live.link()`](/docs/live/link/). This causes the input to always match `js`$.$name`` and vice versa. Note that since we set it up inside the `js`connected()`` callback, this live link will be taken down whenever the component disconnects.

Lastly, we need to define the `js`.setName()`` method. We already declared it in the `yz`<meta method=…>`` tag, so we must define it in our `yz`<script>``. In this case, the logic is simple; we set `js`$.name`` to the function's argument. Since `js`$.$name`` is a live variable linked to the input, this'll automatically update that as well.

### Imports

Sometimes, a third-party or just seperate script needs to be imported into component logic. Even though top-level `js`await`` is allowed in the `yz`<script>`` section, the component logic should generally be synchronous since elements should be available and usable right when they're created. To this extent, static `js`import`` statements are disallowed inside `yz`<script>`` sections. In other words, the `yz`<script>`` in component definitions is not a `attr`type="module"`` script (and adding that attribute does not turn it into one). However, dynamic `js`import()`` statements work as usual and are the recommended way to load a module into a component.

:::warning
**Warning:** A pitfall of using `js`import()`` statements is when using relative URLs. Since Yozo parses and compiles component definitions client-side, it cannot respect the original URL that your script is located at. In other words, relative URLs are resolved against wherever Yozo's script lives. Similarly, `js`import.meta.url`` always resolves to Yozo's script's location.
:::

So, how does importing work in module scripts? The recommended way is to asynchronously load the script and assign it to a property on the state variable [`$`](/docs/components/$/) once ready. Then, write logic for both the case where that key is not yet defined and for when it is defined. For example:

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

The dynamic import is called once for every custom element instance, but this is okay; after the script has loaded once, subsequent `js`import()`` statements resolve immediately, as the browser has cached the modules.

## Usage notes

While it is possible to use top-level `js`return`` statements inside the `yz`<script>`` section, this must not be done as it may break in future versions of Yozo. Similarly, top-level `js`await`` is allowed, but not recommended; it may lead to unexpected behavior and/or slow-to-load custom elements.

Inside the `yz`<script>``, all top-level goodies Yozo provides are available, with an exception for `js`register()``. This exception exists mainly because it is somewhat vaguely named without the `js`yozo`` namespace, and this behavior is consistent with what happens when assigning all Yozo helpers to the global scope (through `js`Object.assign(window, yozo)``). It is also not generally advised to register components from the constructor of other components; if a certain component is needed in another, load them both at the same time for better performance. All other Yozo helpers are thus available directly inside the `yz`<script>``. They should not (and cannot) be overwritten.

## See also

- [`$`](/docs/components/$/)
- [`query()`](/docs/components/query/)
- [`connected()`](/docs/components/connected/)
- [`disconnected()`](/docs/components/disconnected/)
- [`<meta>`](/docs/components/meta/)
- [`<template>`](/docs/components/template/)
