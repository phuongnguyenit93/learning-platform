Use a builder when text is assembled through loops, many branches, or repeated appends.

After `toString()`, the resulting String is immutable in the usual String sense; later builder mutations do not turn that String into mutable text.

### Snapshot semantics

```java
StringBuilder b = new StringBuilder("java");

String first = b.toString();
b.append("-core");
String second = b.toString();

System.out.println(first);  // java
System.out.println(second); // java-core
```

`first` does not change when the builder changes later.

### Common buffer operations

Besides `append`:

```text
insert(index, value)
delete(start, end)
replace(start, end, value)
reverse()
```

Use them when you are genuinely editing a **construction buffer**. If you already have a final String and only need a simple transformation, String APIs often express the intent more directly.

### Thread-safety boundary

`StringBuilder` is not synchronized and is not intended for one mutable instance to be modified concurrently without coordination.

A common pattern is:

```text
method/thread-local builder
→ build
→ toString
→ publish immutable String
```
