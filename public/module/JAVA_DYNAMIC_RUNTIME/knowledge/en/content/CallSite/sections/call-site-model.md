`CallSite` is an object that holds a `MethodHandle target`. Once an `invokedynamic` instruction is linked to a CallSite, calls delegate to the **current target** of that CallSite.

Three important pieces:

```text
CallSite
├── type()           → permanent MethodType
├── getTarget()      → current target
└── dynamicInvoker() → MethodHandle that invokes through the CallSite
```

Example:

```java
MethodHandle target =
        MethodHandles.constant(
                String.class,
                "v1"
        );

CallSite site =
        new ConstantCallSite(target);

MethodHandle invoker =
        site.dynamicInvoker();
```

CallSite does not discover a method by itself. It is the runtime abstraction that **holds the target** after bootstrap or another runtime policy has selected that target.
