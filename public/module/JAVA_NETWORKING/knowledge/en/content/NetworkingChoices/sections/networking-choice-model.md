At the end of the module, the useful question is no longer “which classes exist?” but **which abstraction matches the current communication problem?**

A practical decision model has five dimensions:

1. **Data semantics** — byte stream, datagrams, request/response, or a message-oriented connection?
2. **Peer relationship** — one long-lived connection or independent interactions?
3. **Concurrency model** — blocking thread-per-task, selector readiness, or asynchronous completion?
4. **Control level** — must the application own framing/socket options, or should a higher-level API own the protocol?
5. **Lifecycle/failure** — who owns timeout, cancellation, close, and retry policy?

~~~text
problem
 ↓
communication semantics
 ↓
required control
 ↓
concurrency/lifecycle constraints
 ↓
smallest suitable JDK abstraction
~~~

A lower-level API is not automatically faster, and a higher-level API is not automatically simpler in every case. Choose **the lowest abstraction level that is necessary, but no lower**.

If the task is simply to call an HTTP endpoint, manually opening a Socket and implementing HTTP framing adds unnecessary complexity. If the task is a custom binary TCP protocol, HttpClient is the wrong abstraction.
