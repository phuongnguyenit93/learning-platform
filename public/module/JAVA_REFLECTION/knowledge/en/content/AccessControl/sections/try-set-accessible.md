`Field`, `Method`, and `Constructor` inherit from `AccessibleObject`. A reflected object can carry a flag that suppresses Java language access checks when the runtime allows it.

```java
Method method = PaymentService.class.getDeclaredMethod("internalStatus");

if (method.trySetAccessible()) {
    Object value = method.invoke(new PaymentService("demo"));
    System.out.println(value);
}
```

`trySetAccessible()` attempts to enable access and returns `true` when it succeeds. If the current boundary does not permit deep reflective access, it returns `false`. `setAccessible(true)` requests the same outcome but fails with `InaccessibleObjectException` when access cannot be enabled.

Neither API should be read as “make private public.” The member's modifiers do not change. These calls only control whether the reflected object may suppress language access checks when used.

Before the JPMS details, keep a two-layer mental model:

~~~text
Java access rules
public / protected / package-private / private
        ↓
module boundary (when named modules are used)
exports → lets other modules use a package's public API
opens   → permits deep reflection into that package
~~~

`exports` and `opens` solve different problems. A package can expose a public API while still refusing deep reflection into its private internals.

Inside the same module, reflection can generally enable access to members of classes in that module. An **unnamed module** is the implicit module used by classpath code without a `module-info.java`; an **open module** is a named module declared with `open module ...`, making its packages open for deep reflection by default. Packages in those cases are open for this purpose. Across other named modules, `exports` and `opens` become part of the decision.

A practical pattern is to **attempt access and handle failure explicitly**:

```java
Method method = PaymentService.class.getDeclaredMethod("internalStatus");

if (!method.trySetAccessible()) {
    throw new IllegalStateException("PaymentService is not open for reflective access");
}

String status = (String) method.invoke(service);
```

This is safer than assuming `setAccessible(true)` always works and discovering the module boundary only after deployment.
