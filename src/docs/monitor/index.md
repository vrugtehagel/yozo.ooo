---
{
	"title": "monitor()",
	"terms": "monitor context manual see watch undo live types register ignore add",
	"description": "`monitor()`{js} is the low-level (but exposed) API responsible for monitoring the use of flows and reactive variables."
}
---

## Syntax

```js
monitor(types, callback);
```

### Parameters

`types`{arg}
: An array of the types to monitor the callback for. By default, the only valid types are `'undo'`{js} and `'live'`{js}, though custom types may be extended using [`monitor.register()`](/docs/monitor/register/).

`callback`{arg}
: A function to monitor. This may be an asynchronous function, though for monitorability `await`{js} must be used in conjunction with [`until()`](/docs/monitor/until/).


### Return value

A call object; it is guaranteed a `.result`{js} key containing the return value of the function. For each type monitored, there is a same-named key on the call object with the aggregated monitoring data. The exact type or shape of these values differ on a per-type basis; see monitoring [undo](/docs/monitor/undo/) and monitoring [live](/docs/monitor/live/) for details on their respective interfaces.

### Methods

[`monitor.ignore()`](/docs/monitor/ignore/)
: Inside a monitored context, prevents the monitoring of its callback.

[`monitor.add()`](/docs/monitor/add/)
: Manually notifies the monitored context of an item for a sepecific type to be monitored.

[`monitor.register()`](/docs/monitor/register/)
: Register custom monitorable types.

### Related

Monitoring async functions with [`until()`](/docs/monitor/until/)
: Asynchronous functions are not out-of-the-box monitorable. `await`{js} expressions break the synchronous flow of functions, and as such, `until()`{js} has to be used with `await`{js} in order for asynchronous functions to remain monitorable.

Monitoring the ["undo"](/docs/monitor/undo/) type
: Used internally in flows, is intended to define cleanup functions for contexts that benefit from it.

Monitoring the ["live"](/docs/monitor/live/) type
: For internal use only. This type is used for monitoring the use of live variables.

## Details

The monitoring system is used internally to monitor for live variables as well as cleanup callbacks. It monitors a callback by opening a monitored context right before it executes the callback to be monitored. Only one monitored context can be open at any given moment; when opening a new monitored context inside another, it pauses the outer context for the duration of the inner one. After the callback has returned, the monitored context is closed, and the aggregated monitoring data is returned from the `monitor()`{js} call in the form of a so-called "call object". In the case of an asynchronous callback, it is possible that this call object implicitly changes over time. Once this call object has been obtained, it is possible to hook into when a live variable that was used in the callback changes, or we could run the cleanup callbacks that were added to the monitored context. In practice, this is rarely something that needs to be handled manually, and even if so, it's good practice to write a wrapper function for the specific use-case. It is also good to understand where Yozo uses this mechanism; specifically,

- [`effect()`](/docs/effect/) monitors for both live variables (type "live") as well as cleanup callbacks (type "undo");
- [`purify()`](/docs/purify/) monitors only for cleanup callbacks;
- [`connected()`](/docs/components/connected/) and [`disconnected()`](/docs/components/disconnected/) monitor for cleanup callbacks;
- Inside the template, reactive expressions (such as an [`:attribute`](/docs/components/template/attributes/) or [`{{ inline }}`](/docs/components/template/inline/) expression) act like an `effect()`{js} and so are monitoring for both live variables as well as cleanup callbacks.

There are not actually many different places where things are added to a monitoring context. For the "live" type, only accessing live variables does so, and for the "undo" type, only the creation of [flows](/docs/flow/) does so. Note that the latter happens quite a bit; [`when()`](/docs/when/) creates and returns a `Flow`{js}, hooks such as `connected()`{js} do, [`effect()`](/docs/effect/) does, timing-related functions such as [`interval()`](/docs/interval/) do, and even [`register()`](/docs/register/) does.

## Examples

While monitoring manually is generally not needed, here's an example of monitoring for cleanup callbacks.

### Monitoring cleanup

See the following snippet of code:

```js
const call = monitor(['undo'], () => {
	when(button).clicks().then(() => {
		console.log('button clicked!');
	});
});

button.click(); // "button clicked!"
call.undo();
button.click(); // * crickets *
```

In this example, we monitor a hard-coded callback (which isn't particularly useful for anything other than educational purposes). We monitor only for "undo" through the first argument, `['undo']`{js}, and provide a callback that sets up an event listener using [`when()`](/docs/when/). Since `when()`{js} returns a flow, and flows add a cleanup callback to the monitored context, the returned `call`{js} object can undo this event listener using the `.undo`{js} key (which is a function - see ["undo"](/docs/monitor/undo/) for more details).

## Usage notes

As mentioned, this API is very low-level and generally not to be used willy-nilly. If monitoring is needed, and no function exists for it yet in Yozo, write a wrapper function for more readable and streamlined monitoring.
