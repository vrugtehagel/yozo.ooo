---
{
	"title": "<meta>",
	"terms": "meta attribute property method form associated hook declar defin interface document",
	"description": "Define component metadata through `<meta>`{yz} tags, such as attributes, properties, methods, and more."
}
---

Components in Yozo are custom elements. That means that they, like regular HTML elements, have a certain interface; pre-defined attributes, properties, methods, events, etcetera. Yozo's component structure is designed to make it easy to understand a component's interface just by glancing at its definition file. When defining properties and methods on the state variable for the component, [`$`](/docs/components/$/), the meta tags are responsible for exposing said properties on the actual component. The different types of meta tags Yozo understands are:

- [`<meta attribute=…>`](/docs/components/meta/attribute/) to define attributes on the custom element. Additional options allow for creating a matching property (as many attributes have) and setting a default value.
- [`<meta property=…>`](/docs/components/meta/property/) for definition a property. Optionally, the property may be marked read-only.
- [`<meta method=…>`](/docs/components/meta/method/) for defining a method. These are always read-only.
- [`<meta form-associated>`](/docs/components/meta/form-associated/) to mark an element as, well, form-associated. This needs to be set to allow components to contribute in forms.
- [`<meta hook=…>`](/docs/components/meta/hook/) is a lower level type that allows for exposing lifecycle callbacks that are not predefined in Yozo.

## Examples

### Attributes

In vanilla web components, we need to use lifecycle callbacks and getters and setters to hook into things changing. In Yozo, we use the component's state variabele [`$`](/docs/components/$/) to react to attributes or properties changing. In particular, the `.attributeChangedCallback()`{js} lifecycle callback is unavailable since it is replaced by the individual live variables for the attributes (and the parent bucket for them, `$.$attributes`{js}). For example:

```yz
<title>measuring-beaker</title>
<meta attribute="amount" type="number">
<script>
when($.$amount).changes().then(() => {
	console.log(`The amount is now ${ $.amount }`);
});
when($.$attributes.$amount).changes().then(() => {
	// listen to the attribute itself
});
</script>
```

The former expression listens for changes in `$.$amount`{js}, which is the live variable created for the property matching the "amount" attribute. This property is created because we provided `type="number"`{attr}, which indicates we want a matching property that converts the attribute's value (which is always a string or `null`{js}) to a number. If we leave the `type`{attr} option off completely, no property is created and we'll need to listen to changes in `$.$attributes.$amount`{js}, which represents the attribute itself.

Note that generally we don't even need to explicitly listen for changes to the attributes or properties, but we can use them in [`effect()`](/docs/effect/) expressions. That way, we can describe the behavior of the component in a readable manner instead of jumping through hoops to make it happen.

### Custom checkbox

As a more complete example, let's create a custom form-associated checkbox element. We'll have a boolean `checked`{attr} attribute, and a `name`{attr} attribute. Both of them will have associated properties as well. We'll then create a `.value`{js} property, as an alias of the `.checked`{js} property, and a `toggle()`{js} method to toggle the checkbox programatically.

```yz
<title>check-box</title>
<meta attribute="checked" type="boolean">
<meta attribute="name" type="string">
<meta property="value">
<meta method="toggle">
<meta form-associated>

<template mode="closed">
	<div @click="$.toggle()"></div>
</template>
<script>
$.toggle = () => {
	$.checked = !$.checked;
};

const internals = this.attachInternals();
when($.$checked).changes().then(() => {
	internals.setFormValue($.checked);
});

live.link($.$value, {
	get: () => $.checked,
	set: value => $.checked = value,
	changes: when($.$checked).changes()
});
</script>
<style>
:host {
	display: inline-block;
	width: 3em;
	height: 3em;
}

div {
	width: 100%;
	height: 100%;
	background: white;
	:host([checked]) & { background: skyblue; }
}
</style>
```

We first defined the component name using the [`<title>`](/docs/components/title/) element, and then proceed to specify the attributes, extra property, and the `.toggle()`{js} method. Then we go into more detail, defining the template, the logic for the `.toggle()`{js} method, and we handle setting the internal form value to be submitted alongside forms using the native `.attachInternals()`{js}. Lastly, we define the `.value`{js} property as an alias of the `.checked`{js} property using [`live.link()`](/docs/live/link/). We also define some very basic styles, to make the element usable.

## Usage notes

Some things could be nice to express in the form of meta tags, such as events a component may dispatch. While Yozo could potentially introduce new types of meta tags in the future, it is entirely possible to add meta tags that Yozo does not understand, such as e.g. `<meta event="input">`{yz}. Authors are encouraged to document these, though for those worried about forward compatibility, note that using any other dash-including tag name is future-proof. In other words, instead of documenting additional interface properties using `<meta>`{yz}, using e.g. `<x-meta>`{yz} will never clash with future versions of Yozo.

## See also

- [`<meta attribute=…>`](/docs/components/meta/attribute/)
- [`<meta property=…>`](/docs/components/meta/property/)
- [`<meta method=…>`](/docs/components/meta/method/)
- [`<meta form-associated>`](/docs/components/meta/form-associated/)
- [`<meta hook=…>`](/docs/components/meta/hook/)
- [`$`](/docs/components/$/)
- [`<title>`](/docs/components/title/)
