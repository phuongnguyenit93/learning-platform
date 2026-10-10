UTF-16 represents supplementary code points with a high-surrogate + low-surrogate pair.

One emoji can therefore produce:

```text
String.length() == 2
codePointCount(...) == 1
```

Iterating naïvely by `char` can split a valid code point in half.

```java
String emoji = "😀";

char high = emoji.charAt(0);
char low  = emoji.charAt(1);

Character.isHighSurrogate(high); // true
Character.isLowSurrogate(low);   // true
```

Those two `char` values are not two user-visible characters.
