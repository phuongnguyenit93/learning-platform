A **code point** is a Unicode code value such as `U+0041` or `U+1F600`.

Java commonly represents code points as `int` because the Unicode space is larger than one `char`.

Code points are commonly written as:

```text
U+0041  → A
U+00E9  → é
U+1F600 → 😀
```

APIs such as `codePointCount` and `codePoints()` let code operate at that level.

Another useful helper is:

```java
char[] chars = Character.toChars(0x1F600); // surrogate-pair char[] for 😀
```

An `int` is not automatically within the Unicode code-point range. `Character.isValidCodePoint(cp)` checks the `0..0x10FFFF` range, but that does **not** mean `cp` is a Unicode scalar value: surrogate code points `U+D800..U+DFFF` are still within the code-point range. If the domain requires a valid scalar value, exclude the surrogate range in addition to checking the range.
