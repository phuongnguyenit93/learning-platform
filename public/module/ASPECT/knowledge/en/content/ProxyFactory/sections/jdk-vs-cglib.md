The experiment uses the same:

```text
GreetingTarget
TracingMethodInterceptor
```

but creates two proxies.

JDK proxy:

```java
factory.setInterfaces(GreetingOperations.class);
factory.setProxyTargetClass(false);
```

The caller interacts through the `GreetingOperations` interface.

A JDK proxy exposes the interface surface and does not become a subclass of `GreetingTarget`. Therefore the response contains:

```text
proxyIsGreetingOperations = true
proxyIsGreetingTarget     = false
targetOnlyCapabilityVisibleThroughProxyType = false
```

The `targetOnlyCapabilityVisibleThroughProxyType` fact is calculated by inspecting public methods on the **runtime proxy class**, not by hard-coding a boolean.

CGLIB proxy:

```java
factory.setProxyTargetClass(true);
```

The proxy is a subclass of `GreetingTarget`.

Therefore the concrete type surface remains visible:

```text
proxyIsGreetingOperations = true
proxyIsGreetingTarget     = true
targetOnlyCapabilityVisibleThroughProxyType = true
```

The experiment also calls:

```java
cglibProxy.targetOnlyCapability()
```

directly, proving that a method defined only on the concrete target class is still part of the class-based proxy's type surface.

The lesson is not that one proxy is universally "better". The strategy determines the type surface and some interception limitations.

This connects directly back to `this(...)` and `target(...)` in the Pointcut chapter. With the JDK proxy in this experiment:

```text
proxy object
→ implements GreetingOperations
→ is not GreetingTarget

target object behind the proxy
→ GreetingTarget
```

So `this(...)` observes the proxy's type surface, while `target(...)` observes the target type. This is why the two designators can produce different results when the proxy strategy changes.
