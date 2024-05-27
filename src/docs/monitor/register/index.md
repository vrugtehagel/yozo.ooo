---
{
	"layout": "layouts/docs.liquid",
	"title": "monitor.register()",
	"terms": "monitor register define custom types result add until",
	"description": "Define and register custom monitorable types using `monitor.register()`{js}, to be monitored manually using `monitor()`{js}."
}
---

:::warning
**Warning:** This is an extremely low-level function. It is not to be used lightly and requires a full understanding of [monitoring](/docs/monitor/).
:::

## Syntax

```js
monitor.register(type, definition);
```

### Parameters

`type`{arg}
: A string for the custom type. The types [`'undo'`](/docs/monitor/undo/) and [`'live'`](/docs/monitor/live/) are registered already and cannot be overwritten.

`definition`{arg}
: A `class`{js} with certain properties and methods describing how the type should be monitored. The class is instantiated once for each monitored context that monitors for `type`{arg}. It should have the following interface:

	`result`{js}
	: The key under which the resulting accumulated monitored items are found. This should be an object or function reference, and should not itself change over the course of a monitored context (though properties on said object or function may change).

	`add()`{js}
	: A method, called once every time an item is added to the monitored context using [`monitor.add()`](/docs/monitor/add/). It receives the arguments passed to the respective `monitor.add()`{js} call, excluding the first argument (which specifies the `type`{js}).

	`until()`{js} <mark>optional</mark>
	: A method, called right before [`until()`](/docs/monitor/until/) wants to resume a monitored context. It should return a boolean value; if it returns `true`{js}, then `until()`{js} does not continue the monitored context. If it returns `false`{js}, then `until()`{js} resumes the monitored contexts as usual. Omitting the method altogether is equivalent to having it always returning `false`{js}.

### Return value

None (`undefined`{js}).

## Details

The `monitor.register()`{js} function exposes the inner workings of monitoring types ["undo"](/docs/monitor/undo/) and ["live"](/docs/monitor/live/), and lets authors build on the monitoring system already in place. While registering new types does not directly interact with monitored contexts Yozo creates, it can be used in conjunction with [`monitor()`](/docs/monitor/) and [`monitor.add()`](/docs/monitor/add/) to create completely custom systems that "see" the use of specific functions or items. It is strongly recommended that references to `monitor()`{js} and related functionality is abstracted away behind wrapper functions or classes for a more streamlined developer experience.

Types may be registered later in the life of a document, but existing monitered contexts do not retroactively use a defined type, since the call's `result` object for each type has already been created.

It is not possible to overwrite or update types (other than modifying the definition class); calls to `monitor.register()`{js} with a `type`{arg} argument that was already registered are ignored. Furthermore, while it is technically possible to register the type `'result'`{js}, this must not be done since `monitor()`{js} overwrites the `.result`{js} key on its return value with the return value from the callback function. In other words, `'result'`{js} could be registered as a monitorable type, but cannot practically be monitored.

## Examples

### Monitoring undo

We'll have a look at what a re-implementation for the monitored type ["undo"](/docs/monitor/undo/) might look like. Note that the actual implementation differs from this implementation since it optimizes for bundle size whereas this example focuses more on readability. First, we need to define the `class`{js} responsible for handling and aggregating the cleanup callbacks for each monitored context. An instance of this class is created every new monitored context.

```js
class AlsoUndo {
	#stopped = false;
	#callbacks = [];

	add(callback){
		if(this.#stopped){
			callback();
		} else {
			this.#callbacks.push(callback);
		}
	}

	result = () => {
		if(this.#stopped) return;
		for(const callback of this.#callbacks){
			callback();
		}
		this.#callbacks = [];
		this.#stopped = true;
	}

	until(){
		return this.#stopped;
	}
}
```

We need to keep track of two primary things; a boolean `#stopped`{js} indicating whether or not we have "undone" the monitored context in question, and an array of cleanup `#callbacks`{js}. The array aggregates the callbacks from the monitored context, so they may be run when the context is undone.

The `add()`{js} method is responsible for adding the callbacks to the context. We need to handle both the case of an already-undone monitored context (in which case we fire the callback immediately) and one that has not yet been undone (for those, we add the callback to our `#callbacks`{js} array).

Next, the `result`{js} key. It is very important that the `result`{js} key is never changed, since it is only read once when a monitored context is created. This is the object (or, in this case, function) that is exposed in the return value of `monitor()`{js} under the key with the name matching the monitored type's name. Our implementation here early-returns if the monitored context was already undone, since the cleanup should only ever happen once. Otherwise, we run the callbacks, clean up the references to them, and set the `#stopped`{js} property.

Lastly, we add an `until()`{js} method, with which we can tell the same-named [`until()`](/docs/monitor/until/) function to stop resuming the monitored context. Conveniently, we only need this to happen when `this.#stopped`{js} is `true`{js}, and therefore we can return it directly.

Now, to register it, we need to call `monitor.register()`{js} and pass it a type (let's go for `'alsoUndo'`{js}) and the `AlsoUndo`{js} class we defined above:

```js
monitor.register('alsoUndo', AlsoUndo);
```

Now, the type is ready to be monitored. For the sake of the example, we'll use `monitor.add()`{js} and `monitor()`{js} directly, but it is advised to abstract these calls away in higher-level functions when used in real projects.

```js
const call = monitor(['alsoUndo'], () => {
	// code…
	monitor.add('alsoUndo', () => {
		console.log('undone!');
	});
	// more code…
});
```

Then, since the type is called `'alsoUndo'`{js} we can later call `call.alsoUndo()`{js} to run the cleanup callbacks. The `call.alsoUndo()`{js} function is the same one we've defined under the `result`{js} key in our `AlsoUndo`{js} implementation.

## See also

- [`until()`](/docs/monitor/until/)
- [`monitor()`](/docs/monitor/)
- [`monitor.add()`](/docs/monitor/add/)
- [monitoring "undo"](/docs/monitor/undo/)
