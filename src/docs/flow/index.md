---
{
	"title": "Flow",
	"terms": "flow one single more multiple future triggers events listeners timers observers monitor methods",
	"description": "Flows represent one or more future events, like listeners or timers. The monitoring and their methods make common patterns a walk in the park."
}
---

The `Flow`{js} class is primarily used to represent things happening at some point in the future. It can be hooked into with methods such as [`flow.then()`](/docs/flow/then/). To cover the most common use cases, there are some handy helper functions available, specifically:

- Event listeners are provided through [`when()`](/docs/when/);
- Timeouts (`setTimeout()`{js}) are implemented through [`timeout()`](/docs/timeout/);
- Intervals (`setInterval()`{js}) through [`interval()`](/docs/interval/);
- [`frame()`](/docs/frame/) triggers every frame, like a nested `requestAnimationFrame()`{js};
- The [`paint()`](/docs/paint/) function can be used to wait for the browser to paint a frame (mostly useful for manual animations);
- Observers, such as `MutationObserver`{js}, get [`when().observes()`](/docs/when/observes/);
- Lastly, many hook-like functions, such as [`effect()`](/docs/effect/) or [`connected()`](/docs/components/connected/), return a flow both to facilitate monitoring, as well as making it easy to terminate or hook into them.

Flows actually represent not only the triggers that may occur in the future, but the entire pipeline they run through when those triggers happen. Most commonly, `flow.then()`{js} is used to add a single synchronous callback to the pipeline. However, is is also possible to filter out certain triggers using [`flow.if()`](/docs/flow/if/), or even rate-limit them using [`flow.throttle()`](/docs/flow/throttle/) or [`flow.debouce()`](/docs/flow/debounce/).

## Interface

### Constructor

[`new Flow()`](/docs/flow/constructor/)
: Creates a new `Flow`{js} object.

### Methods

[`flow.then()`](/docs/flow/then/)
: A callback to run (add to the flow pipeline) when a flow triggers.

[`flow.if()`](/docs/flow/if/)
: Conditionally let triggers flow into the next callback in the pipeline.

[`flow.stop()`](/docs/flow/stop/)
: Immediately stop all triggers from flowing and run the cleanup callbacks.

[`flow.cleanup()`](/docs/flow/cleanup/)
: Add a cleanup callback, to be run whenever the flow is killed.

[`flow.until()`](/docs/flow/until/)
: Schedule the flow to stop, either as a result of a trigger (by providing a function) or as a result of a promise or another flow (by passing said promise or flow).

[`flow.once()`](/docs/flow/once/)
: Stop a flow after a single trigger has been fired, but let said trigger complete the pipeline.

[`flow.or()`](/docs/flow/or/)
: Adopt the triggers from another flow into the current one. Additionally, if the current flow stops, then the added flow is also stopped.

[`flow.now()`](/docs/flow/now/)
: Manually trigger a flow, optionally with arguments.

[`flow.pipe()`](/docs/flow/pipe/)
: A generic method able to handle more complex operations regarding the flow pipeline.

[`flow.after()`](/docs/flow/after/)
: A method improving code ergonomics in cases where the trigger in question is triggered as a result of another operation (such as listening for a load event after setting its `src`{js}).

[`flow.throttle()`](/docs/flow/throttle/)
: Throttles incoming triggers with a certain duration, letting triggers go through as much as possible but at most once per duration.

[`flow.debounce()`](/docs/flow/debounce/)
: Debounces incoming triggers with a certain duration, letting triggers go through only after there were no additional triggers for the specified duration.

## Details

### The flow pipeline

To get the most out of using flows, it is good to understand how triggers flow through their respective pipeline. To illustrate, let's look at the following snippet:

```js
when(input).keydowns()
	.then(event => console.log(`${ event.key } pressed`))
	.throttle(2000)
	.if(event => event.key == 'Enter')
	.once()
	.then(() => console.log('Done!'));
```

This pipeline in particular is much more complex than is common, but it is a good example to help understand how flows work. The flow in question is one that triggers whenever a user presses a key into a certain input. Let's now look at the first keypress a user might do (and let's say it's the 'y' key). Then, the first step in the pipeline is the `.then()`{js} call, and so "y pressed" is logged. The trigger moves on to the next step, the `.throttle(2000)`{js} call. Since this is the first trigger to reach this step, there's nothing yet to throttle; the trigger gets let through immediately to reach the `.if()`{js}. Here, the trigger fails the condition and this is where its journey ends. Note that since it hasn't yet reached the `.once()`{js}, the flow remains active. Let's now say one second elapsed, and we mash 'Enter' 5 times. Each trigger gets sent through the pipeline, logging "Enter pressed" 5 times. Then, they reach the throttle step. Here, they all come to a halt because a trigger was let through one second ago. The throttle therefore patiently waits another second, until the 2 seconds are up, then lets through one of the triggers to the next step, discarding the other 4. This time, the trigger passes the condition in the `.if()`{js} step, and so hits the `.once()`{js} call. This would halt all other triggers in the pipeline, but in this case there are none. The last trigger gets to finish the pipeline though, and so "Done!" gets logged in the last `.then()`{js} call.

### Tracking contexts

Flows are monitored in some contexts, such as inside an `effect()`{js} or the `connected()`{js} hook. When the callbacks re-run, they can kill of all the flows that were created in the previous run of the callback, to make sure there are no memory leaks. In practice, this means there's rarely a need to manually remove event listeners, stop timeouts, or other similar operations. Let's have a look at an example; we create some live data, specifically an array and an "active" index. We want to listen to changes to the array element at the active index. To do this, we set up an effect that finds the live variable for the item in question, and sets up the event listener:

```js
const $data = live({
	activeIndex: 0,
	array: ['foo', 'bar', 'baz']
});

// We want to listen to changes to the item at activeIndex
effect(() => {
	const index = $data.activeIndex;
	const $item = $data.$array['$' + index];
	when($item).changes().then(() => {
		console.log(`Item ${ index } changed!`);
	});
});
```

Now, the effect depends on `$data.activeIndex`{js}, meaning it will re-run the callback whenever the active index changes. The active index starts out being 0, and notice how the first item no longer triggers the console log after setting the active index to 1:

```js
$data.$array[0] = 'qux'; // "Item number 0 changed!"
$data.$array[1] = 'quux'; // * crickets *

// This will stop the active listener and set up a new one
$data.activeIndex = 1;
// Wait for the effect to re-run...
await 'microtask';

$data.$array[0] = 'foo again'; // * crickets *
$data.$array[1] = 'bar again'; // "Item number 1 changed!"
```

In the example above, the `effect()`{js} saw that there was an event listener set up and knew to take it down when the effect re-runs to avoid aggregating event listeners over time. Generally, contexts try to be smart about this; for example, the `connected()`{js} hook takes down listeners when the component disconnects, and so do [`@event`](/docs/components/template/events/) attributes in component template attributes. To take down event listeners (or other uses of flows) manually, use either [`flow.until()`](/docs/flow/until/) or use [`flow.stop()`](/docs/flow/stop/) directly.

## See also

- [`when()`](/docs/when/)
- [`monitor()`](/docs/monitor/)
- [`interval()`](/docs/interval/)
