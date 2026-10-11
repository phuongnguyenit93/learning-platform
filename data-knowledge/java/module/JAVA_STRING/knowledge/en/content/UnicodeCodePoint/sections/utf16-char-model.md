`char` is a 16-bit **UTF-16 code unit**.

Many Unicode characters in the Basic Multilingual Plane fit in one code unit, while supplementary characters require two.

Therefore `String.length()` returns a UTF-16 code-unit count, not necessarily a Unicode code-point count or a user-perceived character count.

Example:

```java
String text = "A😀";

text.length(); // 3 code units: 'A' + surrogate pair
```

This is why index-based APIs such as `charAt` and `substring` operate in UTF-16 code-unit offsets.
