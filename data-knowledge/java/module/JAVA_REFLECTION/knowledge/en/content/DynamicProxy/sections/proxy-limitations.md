The core limitations of JDK Dynamic Proxy follow from its interface-based model:

- without an interface, a JDK proxy cannot expose a concrete class API;
- only instance calls that pass through the proxy reach the `InvocationHandler`;
- static methods and constructors are not interface instance invocations and are not intercepted by a JDK proxy;
- calling the target object directly bypasses the proxy;
- private methods/state outside the interface do not automatically become interception points.
- sealed interfaces and hidden interfaces are not valid proxy interfaces for `Proxy.newProxyInstance(...)` on Java 21.

A concrete `final` class can still be **wrapped** behind a JDK proxy if its object implements an interface, because the JDK proxy does not subclass the target. `final` becomes a constraint for **class-based proxies** that generate subclasses: a final class cannot be extended, and a final method cannot be overridden/intercepted through subclass dispatch.

Spring AOP provides a higher-level proxy abstraction. It can use JDK dynamic proxies for interface-based proxying or class-based proxies (CGLIB in Spring) when proxying concrete classes is required/configured. Because class-based proxying relies on subclassing, final classes, final methods, and private methods cannot be overridden for advice through that mechanism.

Dynamic Proxy also does not solve every interception problem. Constructor interception, static-call interception, bytecode weaving, and self-invocation behavior belong to other mechanisms or design choices. For this Reflection module, the key model is that JDK Proxy provides a runtime-generated **interface implementation** with one handler boundary for calls.

Dynamic Proxy is the final integration milestone before synthesis. At this point reflection should no longer look like merely "calling methods by string"; it is a chain from metadata to runtime behavior:

```text
Class<?> and metadata
→ Field / Method / Constructor descriptors
→ dynamic operations
→ access boundary
→ generic signature metadata
→ interface interception with Dynamic Proxy
```

The final chapter places this whole chain into a decision model: when is that flexibility worth runtime failures, hidden coupling, overhead, and maintenance cost?
