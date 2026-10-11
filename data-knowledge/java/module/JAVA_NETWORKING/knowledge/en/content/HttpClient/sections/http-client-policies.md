HTTP settings do not all live at the same scope. Putting each policy at the correct boundary avoids treating shared client configuration as though it were per-request.

| Concern | Primary JDK API boundary | Meaning |
|---|---|---|
| Preferred HTTP version | `HttpClient.Builder.version(...)`, with a preferred version also available on a request | Expresses HTTP/1.1 or HTTP/2 preference; actual use still depends on the peer/network |
| Redirect | `HttpClient.Builder.followRedirects(...)` | Client policy `NEVER`, `NORMAL`, or `ALWAYS` |
| Connect timeout | `HttpClient.Builder.connectTimeout(...)` | Bounds connection establishment |
| Request timeout | `HttpRequest.Builder.timeout(...)` | Timeout attached to a specific request |
| Proxy | `HttpClient.Builder.proxy(...)` | Client-level `ProxySelector` |
| Authentication | `HttpClient.Builder.authenticator(...)` | Client-level `Authenticator` for HTTP authentication challenges |
| Cookies | `HttpClient.Builder.cookieHandler(...)` | `CookieHandler` shared by the client's requests |
| Async executor | `HttpClient.Builder.executor(...)` | Executor for asynchronous/dependent client work; when omitted, the implementation can still use an internal default executor |

The request owns its URI, method, headers, and body. Client policies form a shared baseline; a request represents one exchange.

These options describe **JDK HTTP mechanics**. Integration decisions such as retry rules by method/status, circuit breakers, service discovery, OAuth flows, domain error mapping, or choosing among HTTP client frameworks belong to the appropriate integration/security modules.
