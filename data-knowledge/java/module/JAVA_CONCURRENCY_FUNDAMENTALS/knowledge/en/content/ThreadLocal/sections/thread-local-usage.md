Common use cases:

- request/correlation id;
- MDC logging (MDC itself is usually thread-bound context-based);
- security/request context in the framework;
- transaction/session context managed by the framework.

ThreadLocal should not be used to turn every parameter into an implicit global state. Explicit parameters are usually easier to test and reason if the context doesn't really need thread-bound semantics.
