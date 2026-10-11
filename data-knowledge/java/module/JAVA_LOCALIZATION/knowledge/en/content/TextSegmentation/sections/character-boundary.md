The `string` module establishes an important Unicode distinction:

```text
char
≠ Unicode code point
≠ always one user-perceived character
```

Localization adds the next step: when code needs to move or cut text by **user-perceived character units**, it should not assume that each UTF-16 `char` is a complete character.

```java
BreakIterator iterator = BreakIterator.getCharacterInstance(locale);
iterator.setText(text);

for (int end = iterator.first(), start = end;
     (end = iterator.next()) != BreakIterator.DONE;
     start = end) {
    String unit = text.substring(start, end);
}
```

`getCharacterInstance(...)` helps locate boundaries corresponding to the character units a user perceives, rather than blindly slicing UTF-16 indexes.

This concept is closely related to Unicode **grapheme clusters**. Code-point, grapheme, and normalization theory remains owned by the `string` module; this chapter owns the localization-side use of **boundary analysis**.

Typical use cases include:

```text
cursor movement
text selection
safe truncation
UI character stepping
```
