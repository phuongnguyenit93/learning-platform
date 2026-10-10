`BreakIterator.getWordInstance(locale)` finds text segments according to locale-sensitive boundary rules:

```java
BreakIterator words = BreakIterator.getWordInstance(locale);
words.setText(text);
```

Do not interpret this as “return a clean list of words with punctuation removed.” `BreakIterator` primarily returns **boundary positions**; application code still decides which segments count as meaningful words for its use case.

Similarly:

```java
BreakIterator sentences = BreakIterator.getSentenceInstance(locale);
sentences.setText(text);
```

finds sentence boundaries without hard-coding literal-period splitting such as `split("\\.")`.

Why are `split(" ")` and even literal-period splitting with `split("\\.")` weak models?

```text
spaces are not a universal word delimiter
punctuation can occur inside abbreviations and numbers
sentence-ending punctuation differs across languages
Unicode text contains many whitespace/punctuation forms
```

`BreakIterator` moves language/Unicode boundary knowledge into a standard API instead of forcing application code to guess.
