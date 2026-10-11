`String` implements `CharSequence`, an abstraction for a sequence of `char` values that can be read by index:

```text
CharSequence
    ↑
    ├── String
    ├── StringBuilder
    └── StringBuffer
```

The important point is that **CharSequence does not imply immutability**. `String` is immutable, while `StringBuilder` and `StringBuffer` are mutable character sequences.

Many APIs accept `CharSequence` so callers are not forced to provide exactly a `String`:

```java
String text = "java-core";
StringBuilder token = new StringBuilder("java");

text.contains(token);       // true
text.contentEquals(token);  // false here because the content differs from "java-core"
```

A key pitfall is that `CharSequence` does not define one cross-implementation equality contract:

```java
String s = "java";
StringBuilder b = new StringBuilder("java");

s.equals(b);        // false
s.contentEquals(b); // true
```

When the contract is content comparison against a `CharSequence`, there is no need to convert every character sequence into a `String` first; `contentEquals(...)` expresses that intent directly.

So:

```text
String-to-String content equality
→ equals

String-to-CharSequence content comparison
→ contentEquals when that contract fits

CharSequence abstraction
→ does not itself guarantee cross-implementation equals
```
