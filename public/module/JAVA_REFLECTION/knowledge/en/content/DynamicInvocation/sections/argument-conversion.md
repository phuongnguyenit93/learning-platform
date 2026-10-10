`Method.invoke` has the shape `invoke(Object obj, Object... args)`, so arguments pass through an `Object[]`. That does not mean runtime reflection accepts arbitrary values and casts them however necessary.

For primitive formal parameters, reflection can unbox wrappers and perform permitted method-invocation conversions, including primitive widening. It does not automatically perform narrowing conversion.

For example:

```java
final class Counter {
    public void record(long value) {
        System.out.println(value);
    }
}

Method record = Counter.class.getMethod("record", long.class);
Counter counter = new Counter();

record.invoke(counter, Integer.valueOf(7)); // int -> long: valid
record.invoke(counter, Long.valueOf(7));    // long -> long: valid
record.invoke(counter, null);               // fails: null cannot unbox to long
```

If the formal parameter were `int`, passing a `Long` would require narrowing from `long` to `int`; `Method.invoke()` does not perform that conversion and throws `IllegalArgumentException`.

A reference argument must be assignable to the formal reference type. `null` is valid for a reference parameter but not for a primitive parameter. Primitive return values are boxed for the caller of `invoke()`, while a `void` method produces `null`.

Varargs create another boundary that can surprise dynamic code. `Method.invoke()` is itself a varargs API, while the target method can also be varargs. Reflection does not reproduce every source-level compiler packing decision automatically; dynamic code should construct the argument shape expected by the actual target method.

When arguments come from configuration, plugins, or serialized input, validating the resolved signature and values before invocation makes failures easier to diagnose. Otherwise type errors appear only at the `invoke()` boundary.
