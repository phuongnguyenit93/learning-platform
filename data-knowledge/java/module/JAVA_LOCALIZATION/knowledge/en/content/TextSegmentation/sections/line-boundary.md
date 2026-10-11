`BreakIterator.getLineInstance(locale)` finds **line-break opportunities** — places a renderer may consider when wrapping text.

That differs from:

```text
\n
→ a newline already present in the data
```

A line-break opportunity asks:

```text
If a UI must wrap a long line,
where is a valid boundary to consider breaking it?
```

This matters for UI/layout engines, document rendering, and text editors. A typical backend rarely performs its own text layout, but developers should still know that “wrap every N characters” can split natural-language text incorrectly.
