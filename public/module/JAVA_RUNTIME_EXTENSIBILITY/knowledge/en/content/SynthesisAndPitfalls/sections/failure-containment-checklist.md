Before activating or replacing a plugin, check at least:

```text
[ ] Is the provider discovery context explicit?
[ ] Was service/capability compatibility validated?
[ ] Is ambiguity/priority policy defined?
[ ] What happens when a required provider is missing?
[ ] Which resources are rolled back after initialization failure?
[ ] Which threads/executors/sockets/files does the plugin create?
[ ] Who owns cleanup?
[ ] How are in-flight requests drained or cancelled?
[ ] Does any host/global cache retain plugin classes or instances?
[ ] Are context ClassLoader and ThreadLocal state restored?
[ ] Does observability include plugin identity/version/cause?
```

This checklist does not replace architecture, but it turns “reload the plugin” from a vague phrase into a lifecycle with explicit ownership.

Test containment using providers that intentionally fail during discovery, initialization, request processing, and cleanup—not only the happy path.
