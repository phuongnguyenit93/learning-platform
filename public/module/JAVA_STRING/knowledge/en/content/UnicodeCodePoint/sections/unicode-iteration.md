When the logic truly works with Unicode code points, use code-point-aware APIs:

```java
text.codePoints().forEach(System.out::println);
```

Real code can replace `System.out::println` with the domain operation that processes each code point.

or use `codePointAt` with `Character.charCount(cp)` when manually advancing an index.

For indexed iteration:

```java
for (int i = 0; i < text.length(); ) {
    int cp = text.codePointAt(i);
    // process cp
    i += Character.charCount(cp);
}
```

When moving by N code points from an existing offset, `offsetByCodePoints` is safer than manually incrementing by one code unit.

Choose the representation level that matches the question; not every String loop needs code-point iteration.
