The characteristic failure is `WrongMethodTypeException`: the caller descriptor and the handle type do not match under the rules of `invokeExact` or `invoke`.

```java
MethodHandle h = ...; // (Greeter,String)String

// Caller expects int, but the handle returns String.
int value = (int) h.invokeExact(greeter, "A");
```

Keep type failures separate from lookup failures:

```text
lookup/find...
→ NoSuchMethodException / NoSuchFieldException
→ IllegalAccessException

invoke/adapt...
→ WrongMethodTypeException
→ ClassCastException on relevant conversion paths
```

Exceptions thrown by the underlying target **propagate unchanged** through `invokeExact`/`invoke`; MethodHandle does not wrap them in `InvocationTargetException` the way `Method.invoke` does. Because the API declares `throws Throwable`, direct callers must catch or declare the appropriate throwable type.

Another edge case is class identity: a `MethodType` contains live `Class` objects. Two classes with the same binary name but loaded by different class loaders are still different types, so MethodHandle type matching accounts for class-loader identity. Deeper class-loading mechanics belong to the ClassLoader module.

Debug checklist:

1. print `handle.type()`;
2. inspect the static type of every argument;
3. inspect the expected return type created by assignment/cast;
4. if adapters are involved, inspect the type before and after each adapter.

Treat MethodType as the schema of an invocation, not incidental metadata.
