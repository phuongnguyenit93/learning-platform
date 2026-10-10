# Locale-Aware Text Segmentation

After learning how to translate, format, and sort text, another foundational question remains: **where should a piece of text be split?**

With simple English examples, it is easy to assume:

```text
character → one char
word      → split on spaces
sentence  → split on periods
line      → wrap at the nearest space
```

Those assumptions do not hold for all Unicode text or all languages. Java provides `BreakIterator` to analyze boundaries in natural-language text.
