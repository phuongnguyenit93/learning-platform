**Bidirectional text (bidi text)** is text that contains, or can contain, runs written in different directions.

Two concepts are fundamental:

```text
logical order
→ character order stored in the String / logical content order

visual order
→ the positions in which glyphs are presented after bidi rules are applied
```

The distinction matters because Unicode text should generally remain in **logical order** for consistent data processing, while a renderer applies the Unicode Bidirectional Algorithm to determine visual presentation.

Manually reversing a string to “support Arabic” is therefore dangerous, especially when numbers, punctuation, or embedded English appear inside Arabic/Hebrew content.
