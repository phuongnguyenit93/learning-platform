Inspection operations answer questions such as how long the String is, whether it is empty, whether it contains only whitespace, or which code unit is stored at an index.

```java
String text = " Java ";

text.length();   // 6
text.isEmpty();  // false
text.isBlank();  // false
text.charAt(1);  // 'J'
```

These three states are different:

```text
""        → empty
"   "     → not empty, but blank
" Java "  → neither empty nor blank
```

`isBlank()` uses `Character.isWhitespace(...)`: an empty String or one containing only code points that API classifies as whitespace is blank.

`length()` and `charAt()` operate in terms of **UTF-16 code units**. A Java `char` is not guaranteed to equal one user-visible character; the Unicode chapter develops that boundary in detail.

A valid `charAt(index)` index satisfies:

```text
0 <= index < length()
```

```java
"Java".charAt(4); // StringIndexOutOfBoundsException
```

With a supplementary character:

```java
String emoji = "😀";

emoji.length();  // 2
emoji.charAt(0); // high surrogate, not the whole emoji
```
