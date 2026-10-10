Ask what a parameter does with values of type `T`:

```text
parameter mainly PRODUCES T for the method to read
→ ? extends T

parameter mainly CONSUMES T written by the method
→ ? super T

parameter must both read exact T and write T,
or several positions must preserve the same type relationship
→ often use an exact type or a named type parameter
```

Classic copy shape:

```java
static <T> void copy(
        List<? extends T> source,
        List<? super T> target) {
    for (T value : source) {
        target.add(value);
    }
}
```
