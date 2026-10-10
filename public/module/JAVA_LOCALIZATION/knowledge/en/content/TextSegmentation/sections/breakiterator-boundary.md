`BreakIterator` solves **boundary analysis**; it is not a complete natural-language-processing system.

```text
BreakIterator does
→ character/word/sentence/line boundary analysis

BreakIterator does not automatically do
→ language translation
→ semantic understanding
→ stemming / lemmatization
→ full NLP tokenization for every domain
→ screen rendering
```

Locale selects the relevant boundary rules:

```java
BreakIterator iterator = BreakIterator.getWordInstance(
        Locale.forLanguageTag("vi-VN")
);
```

Keep ownership clear:

```text
String/Unicode module
→ how text is represented

Localization + BreakIterator
→ where natural-language boundaries occur

UI / NLP framework
→ uses those boundaries for selection, layout, or deeper analysis
```

The next chapter addresses another natural-language-text issue: **stored logical order and displayed visual order can differ when LTR and RTL content are mixed**.
