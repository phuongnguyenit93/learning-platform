JDK Dynamic Proxy generates interface implementations; it does not create a subclass of the concrete target class. Therefore:

```java
proxy instanceof PaymentGateway     // true
proxy instanceof PaymentGatewayImpl // false
```

Callers should normally hold the proxy through interface types. If an external API requires the concrete implementation class, a JDK proxy cannot pretend to be that class.

One proxy can implement multiple interfaces:

```java
Object proxy = Proxy.newProxyInstance(
        loader,
        new Class<?>[] { PaymentGateway.class, Auditable.class },
        handler
);
```

Those interfaces must be visible through the class loader used for proxy creation and must satisfy the `Proxy` API constraints. On Java 21, proxy interfaces **must not be hidden interfaces or sealed interfaces**. Non-public interfaces also have stricter package/module rules, which is one reason frameworks commonly proxy public business interfaces.

If multiple proxy interfaces contain methods with the same signature, the handler still receives a `Method` according to JDK proxy selection rules. Handler design should not assume that the declaring interface always corresponds to the particular interface type through which the caller happened to reference the proxy.

Interface default methods are also dispatched through the handler. When a handler intentionally wants to invoke the interface's default implementation, `InvocationHandler.invokeDefault(...)` provides that operation.
