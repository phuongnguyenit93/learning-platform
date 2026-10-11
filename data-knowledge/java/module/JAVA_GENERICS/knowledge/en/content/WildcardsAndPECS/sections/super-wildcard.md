```java
static void addDefaults(List<? super Integer> target) {
    target.add(1);
    target.add(2);
}
```

The method can receive `List<Integer>`, `List<Number>`, or `List<Object>`.

Writing an `Integer` is safe because every possible target type can hold it.

When reading:

```java
Object value = target.get(0);
```

Only `Object` is guaranteed because the actual list may be a `List<Object>`.

### From Wildcards to PECS

Once `? extends T` and `? super T` are available, the practical problem becomes:

```text
"When should I use extends?
When should I use super?
Why?"
```

Consider a copy operation:

```java
static <T> void copy(
        List<? extends T> source,
        List<? super T> target) {
    for (T value : source) {
        target.add(value);
    }
}
```

`source` is where the method **reads T from**. `target` is where the method **writes T into**.

**PECS — Producer Extends, Consumer Super** — is a mnemonic for that direction:

```text
source PRODUCES values we read  → ? extends T
target CONSUMES values we write → ? super T
```

PECS is not a new Java language feature; it is a heuristic for understanding and designing wildcard signatures.
