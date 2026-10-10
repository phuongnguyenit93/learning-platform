`substring` returns a String representing a range of the original text:

```java
String value = "JAVA-21";

value.substring(0, 4); // "JAVA"
value.substring(5);    // "21"
```

The range convention is:

```text
beginIndex inclusive
endIndex   exclusive
```

So `substring(0, 4)` includes indexes `0,1,2,3`.

A negative index, an index beyond `length()`, or `beginIndex > endIndex` violates the boundary and results in `IndexOutOfBoundsException`.

String indexes are UTF-16 code-unit indexes. Do not assume that `substring(i, i + 1)` extracts one user-visible character for arbitrary Unicode text.

Half-open ranges also make the slice length simple:

```text
substring(begin, end)

slice length = end - begin
```

Invalid boundaries include:

```text
begin < 0
end > length()
begin > end
```
