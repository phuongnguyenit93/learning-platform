Networking detects failures; **resilience policy decides what should happen after them**.

Avoid the simplistic rule:

~~~text
catch IOException
→ retry forever
~~~

Safe retry depends on information above transport:

- is the operation idempotent?
- did the request reach the server before the response was lost?
- was the timeout during connect or read?
- should backoff/jitter be applied?
- is there a retry budget or circuit breaker?
- is the error transient or a permanent configuration failure?

An HTTP POST may already have changed server state before the client loses the connection. Retrying merely because an IOException occurred can duplicate side effects.

Networking should:

- expose/classify failures well enough for callers;
- keep timeout, cancellation, and resource state explicit;
- preserve the original cause.

The resilience/integration layer owns retry, circuit breakers, fallback, deadline propagation, and idempotency strategy.

This boundary prevents a transport component from guessing whether a business operation is safe to repeat.
