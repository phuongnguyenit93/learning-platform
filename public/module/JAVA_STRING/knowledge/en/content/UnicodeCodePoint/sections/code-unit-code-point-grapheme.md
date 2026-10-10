Keep three levels separate:

```text
UTF-16 code unit
→ storage unit behind basic char/String APIs

Unicode code point
→ Unicode coded value

grapheme cluster
→ what users often perceive as one displayed character
```

A grapheme cluster may contain several code points, such as a base letter plus combining mark or a multi-code-point emoji sequence.

Even a code-point count is therefore not always the same as “characters visible to the user”.

Example:

```text
"e" + COMBINING ACUTE ACCENT

code points = 2
user often perceives = one "é" grapheme
```

Emoji sequences can also combine multiple code points using variation selectors, skin-tone modifiers, or zero-width joiners.

Choose the abstraction that matches the problem:

```text
Java String storage/indexing
→ code unit may be correct

Unicode symbol processing
→ code point

cursor/delete/count by user-perceived character
→ grapheme boundary
```

### HOW — handling grapheme boundaries in Java

Core String APIs do not provide a “grapheme index” replacement for `charAt(i)`. When UI/editor logic genuinely needs to move or cut text by user-perceived characters, use an appropriate segmentation API.

Java provides `BreakIterator`:

```java
BreakIterator iterator =
        BreakIterator.getCharacterInstance(locale);

iterator.setText(text);
```

It provides locale-aware text-boundary iteration. Full grapheme segmentation is a broader Unicode/localization topic, so this chapter keeps the boundary explicit:

```text
code-unit indexing
→ core String APIs

code-point processing
→ codePoints / codePointAt

user-perceived character boundaries
→ segmentation API such as BreakIterator
→ deeper localization/Unicode policy when the domain requires it
```

### A String can contain an unpaired surrogate

A `String` is a sequence of UTF-16 code units; it does not automatically guarantee that every sequence is well-formed Unicode text.

```java
String malformed = "\uD83D"; // isolated high-surrogate code unit
```

APIs such as `codePoints()` and `codePointCount(...)` are **not Unicode validators** either. They combine a well-formed surrogate pair into one code point, but an unpaired surrogate is still processed as its own value rather than automatically causing validation failure.

So “I have a String” or “I iterated it with codePoints()” is not the same as “I have already validated a Unicode scalar sequence”. This matters especially when encoding bytes or accepting text from an untrusted boundary.
