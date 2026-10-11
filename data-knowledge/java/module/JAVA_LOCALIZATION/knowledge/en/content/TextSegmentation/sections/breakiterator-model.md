`BreakIterator` is an API for finding **valid boundary positions** in text.

It supports four major boundary types:

```text
character boundary
→ boundary of a user-perceived character unit

word boundary
→ natural-language word/token boundary

sentence boundary
→ sentence boundary

line boundary
→ legal/appropriate line-break opportunity
```

It exists because **text boundaries cannot always be inferred correctly from one fixed ASCII character**.

For example:

```text
"hello world"
```

has an obvious space, but not every writing system uses spaces like English. A period also does not always mean “end of sentence.”

The main factories are:

```java
BreakIterator.getCharacterInstance(locale);
BreakIterator.getWordInstance(locale);
BreakIterator.getSentenceInstance(locale);
BreakIterator.getLineInstance(locale);
```

After `setText(...)`, code moves through boundaries using methods such as `first()`, `next()`, `previous()`, `following(...)`, and `preceding(...)`.
