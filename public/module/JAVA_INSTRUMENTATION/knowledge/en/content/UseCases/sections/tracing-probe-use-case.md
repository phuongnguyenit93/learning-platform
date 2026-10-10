A tracing agent usually injects probes at boundaries that create or propagate spans:

~~~text
incoming HTTP
→ start server span

outgoing HTTP / DB / messaging
→ child span + context propagation

method exit/error
→ finish span
~~~

Instrumentation lets a tracing library integrate with a framework without requiring application code to call the tracing API directly.

Context propagation itself can involve thread-local/context objects, async callbacks, or reactive flows. The transformer inserts hooks; propagation semantics belong to the tracing/runtime library.

A common mistake is instrumenting both a low-level and high-level boundary and producing duplicate spans. Targeting must understand framework layering and select stable semantic boundaries.
