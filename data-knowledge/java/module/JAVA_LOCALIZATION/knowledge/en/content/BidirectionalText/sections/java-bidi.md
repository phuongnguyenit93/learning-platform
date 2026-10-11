Java provides `java.text.Bidi` for bidirectional-text analysis.

```java
Bidi bidi = new Bidi(
        text,
        Bidi.DIRECTION_DEFAULT_LEFT_TO_RIGHT
);

boolean baseLtr = bidi.baseIsLeftToRight();
int runCount = bidi.getRunCount();
```

Individual runs can be inspected:

```java
for (int i = 0; i < bidi.getRunCount(); i++) {
    int start = bidi.getRunStart(i);
    int limit = bidi.getRunLimit(i);
    int level = bidi.getRunLevel(i);
}
```

The API can answer questions such as:

```text
what is the paragraph base direction?
does this text range need bidi processing?
how many directional runs exist?
where does each run start/end?
what is each run's embedding level?
```

`Bidi.requiresBidi(...)` can help determine whether a character range requires bidi processing.
