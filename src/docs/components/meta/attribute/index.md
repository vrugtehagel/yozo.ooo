---
{
	"layout": "layouts/docs.liquid",
	"title": "<meta attribute>",
	"description": "The \"attribute\" meta tag describes an attribute, exposing it on the custom element and optionally creating a corresponding property for it."
}
---

## Syntax

```yz
<meta attribute="…">
<meta attribute="…" type="…">
<meta attribute="…" type="…" as="…">
<meta attribute="…" type="…" default="…">
```

### Attributes

Note that the presence of the "attribute" attribute on the [`<meta>`](/docs/components/meta/) tag is required for the following attributes to function.

`attribute`{attr}
: Determines the name of the attribute. It is recommended to only use alphanumeric characters and dashes. For those that value consistency with native HTML elements, note that almost all existing attributes solely consists of alphabetical characters.

`type`{attr} <mark>optional</mark>
: When provided, indicates that a corresponding property should be created. For native HTML elements, most attributes have matching properties, such as `id`{attr}, `hidden`{attr}, or even input's `maxlength`{attr} attribute with its corresponding `.maxLength`{js} property. Since attributes are string-only, the value of the `type`{attr} attribute describes the type to convert the value of the attribute into. The permitted values are: `string`{str}, `number`{str}, `boolean`{str}, and `big-int`{str}.

`as`{attr} <mark>optional</mark>
: When a `type`{attr} is provided, this attribute may be used to rename the created property. By default, the attribute is transformed to camelCase. For example, a `text-color`{attr} attribute gets a `.textColor`{js} property. With `as="color"`{attr}, the property created would be `.color`{js} instead.

`default`{attr} <mark>optional</mark>
: When a `type`{attr} is provided, this value determines a default value for when the attribute in question is absent. For example, for a `maxlength`{attr} attribute of type `number`{str}, by default the property computes to `0`{js} if the `maxlength`{attr} attribute is not present on the custom element in question. With e.g. `default="100"`{attr}, this value becomes `100`{js}.

## Details

Both the attribute as well as the optional related property are added to the live component state variable [`$`](/docs/components/$/). Specifically, the attribute is placed under `$.$attributes`{js}, and the property goes directly into `$`{js} itself. When using `as`{attr}, renaming a property for a certain attribute, then `$.$attributes`{js} receives the attribute's name whereas `$`{js} receives the (renamed) property name.

```yz
<title>front-door</title>
<meta attribute="locked" type="boolean" as="isLocked">
<script>
connected(() => {
	// Log the property (in this case, a boolean)
	console.log($.isLocked);
	// And the attribute (either a string or null)
	console.log($.$attributes.locked);
});

// Listen for changes in the property…
when($.$isLocked).changes().then(() => {
	// …
});
</script>
```

Also note that, like native custom elements, it is not permitted to write to attributes in the constructor, which means you must not write to attributes or their corresponding properties in the top level of a component's [`<script>`](/docs/components/script/) element. Reading them at that stage is allowed, but not particularly useful; all attributes are still `null`{js} at that point. On the other hand, attaching listeners to the properties, as done above using `when($.$locked).changes()`{js}, is very much allowed, although it is more performant to attach these listeners inside a [`connected()`](/components/connected/) callback when possible.

## Examples

### String attributes

String attributes are the simplest type; the properties reflect the attribute's value directly. When the attribute is absent, the property defaults to the empty string unless otherwise specified with `default`{attr}. For example:

```yz
<title>user-info</title>
<meta attribute="first-name" type="string">
<meta attribute="last-name" type="string">
<template mode="closed">
	{{ $.firstName }} {{ $.lastName }}
</template>
```

Now, when we use it as `<user-info first-name="John" last-name="Doe">`{html}, then the component renders "John Doe". We can then also retrieve a reference to the element and do something like `userInfo.firstName = 'Maria'`{js}, which then updates not only the rendered content, but also the `first-name`{attr} attribute itself.

### Number attributes

Attributes with a type "number" property convert whatever the value of the attribute is to a number using the global `Number()`{js} function. This means that anything invalid is transformed into `NaN`{js}, but it also means that it is possible to provide the attribute e.g. `"Infinity"`{str} or `"-0"`{str}. To clamp the property's value to a certain range, say `0`{js} through `122`{js}, set up an effect that reassigns the clamped value to the property whenever it changes.

```yz
<title>user-info</title>
<meta attribute="age" type="number">
<template mode="closed">
	You are {{ $.age }} years old.
</template>
<script>
effect(() => {
	if ($.age < 0){
		$.age = 0;
	} else if ($.age > 122){
		$.age = 122;
	}
});
</script>
```

Now, when we assign an out-of-range value to the attribute, for example by writing `<user-info age="-5">`{html}, then the effect automatically kicks in and corrects the property (and by extension the attribute as well) to `0`{js}. Note that we may also want to, on top of clamping, handle the `NaN`{js} case, since assigning `"abc"`{str} to the `age`{attr} attribute will now result in the property computing to `NaN`{js} instead of a value within the defined range.

### Boolean attributes

Attributes with `type="boolean"`{attr} look at the presence or absence of the attribute to determine whether the corresponding property computes to `true`{js} or `false`{js}. In short, the property is `false`{js} if and only if the attribute is omitted from the element. In all other cases (even when the attribute is set to the empty string) the property computes to `true`{js}. The `default`{attr} option therefore has no effect on boolean properties.

```yz
<title>user-info</title>
<meta attribute="sick" type="boolean">
<template mode="closed">
	You are {{ $.sick ? 'sick :(' : 'healthy!' }}
</template>
```

Now, writing just `<user-info>`{html} prints "You are healthy!" whereas writing something like `<user-info sick>`{html}, or `<user-info sick="yes">`{html}, or any other value (even `sick="false"`{attr}!) will print "You are sick :(". Note that assigning non-boolean values to the property, either inside the component logic or outside of the component, is okay; the value is converted to a boolean automatically.

### Typeless attributes

While it is usually a good idea to create a property for each attribute, this is not always desired and therefore doesn't happen by default. Without the `type`{attr} attribute, the attribute exists on the component and is added to `$.$attributes`{js}, which allows for change listeners and effects. For example, this could be useful in a case where a more complex property type is needed; we can then define an attribute, and manually define and link a property to this attribute using [`<meta property>`](/docs/components/meta/property/) together with [`live.link()`](/docs/live/link/).

```yz
<title>user-info</title>
<meta attribute="dateofbirth">
<meta property="dateOfBirth">
<template mode="closed">
	Born on {{ $.dateOfBirth.toDateString() }}
</template>
<script>
live.link($.$dateOfBirth, {
	get: () => new Date($.$attributes.dateofbirth),
	set: value => {
		$.$attributes.dateofbirth = value.toDateString()
	},
	changes: when($.$attributes.$dateofbirth).changes()
});
</script>
```

This specific example is a bit fragile in terms of assigning non-date objects to the property, and we may make it a bit more forgiving in `live.link()`{js}'s options (specifically, the `set`{js} handler), but it demonstrates the use case regardless.

## Usage notes

While the properties on a component's state object [`$`](/docs/components/$/) are live, the properties exposed on the custom element itself are not. The exposed properties also do not participate or add anything to [monitored](/docs/monitor/) contexts, unlike using the property on the internal state object `$`{js}, which acts like any other live variable.

## See also

- [`<meta>`](/docs/components/meta/)
- [`$`](/docs/components/$/)
- [components](/docs/components/)
- [`<meta property>`](/docs/components/meta/property/)
- [`live.link()`](/docs/live/link/)
