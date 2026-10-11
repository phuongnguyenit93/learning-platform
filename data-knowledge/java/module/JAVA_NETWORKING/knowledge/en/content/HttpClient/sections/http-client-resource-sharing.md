An `HttpClient` is more than an object with a `send` method. The Oracle API describes it as providing **configuration and resource sharing** for requests sent through it, and the default implementation typically manages a connection pool that may reuse connections when appropriate.

That leads to two ownership rules:

1. Reuse a client at a scope that matches requests sharing its configuration instead of constructing a client for every call.
2. If several components share one client, they also share its underlying lifecycle; a component should not close a client that it does not own.

Connection reuse is implementation/resource behavior, not an API guarantee that request B uses the exact socket from request A. Protocol version, destination, response-body completion, peer behavior, and transport conditions all affect reuse.

An unfinished response body can keep an exchange/connection occupied. Materializing handlers such as `ofString()` normally complete body production before exposing the materialized body value, while streaming handlers transfer continued consumption/close responsibility to the caller.

```text
shared HttpClient
   ├── shared configuration
   ├── managed connections/resources
   └── many HttpRequest exchanges
          ↓
   body lifetime must be completed
   so resources can be released/reused appropriately
```

Do not build application correctness around connection-pool implementation details. Reuse is a client resource optimization; correctness comes from HTTP semantics and the application's contract.
