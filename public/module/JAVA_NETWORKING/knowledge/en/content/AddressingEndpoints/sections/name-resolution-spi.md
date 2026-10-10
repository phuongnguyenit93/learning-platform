Modern Java exposes an **InetAddress Resolver SPI** in the java.net.spi package. It is an extension point for infrastructure or library code that needs to control how host names and addresses are resolved; ordinary applications rarely need to implement it.

The key abstractions are:

- InetAddressResolver, which performs host-to-address and reverse lookups;
- InetAddressResolverProvider, the service provider that supplies the JVM-wide resolver implementation.

Mental model:

~~~text
application
→ InetAddress API
→ service-loaded resolver provider
→ resolver
→ naming system
~~~

The provider participates in Java's service-provider mechanism, so applications using the ordinary InetAddress API can benefit from a custom resolver without replacing every lookup call.

The JVM maintains one system-wide resolver instance for `InetAddress`. After VM initialization, the first lookup causes `InetAddress` to locate providers with `ServiceLoader` through the system class loader; the first provider found supplies that resolver. If no provider is found, the built-in resolver is used. A custom resolver is therefore JVM-wide infrastructure, not a per-request resolver object selected independently by each caller.

Changing the resolver changes **how resolution happens**, not the application-level semantics: a lookup can still fail, can return several addresses, and remains a distinct stage before connect.

The repository has a Java Version module for the feature's Java 18 introduction. Networking owns the current conceptual/runtime view; Java Version owns the release-history view.
