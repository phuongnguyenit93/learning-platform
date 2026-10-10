# Core String Operations

After learning that `String` is immutable and that text equality is value-based, the next step is learning how to **inspect, search, extract, transform, split, join, convert, and format text** with the core `String` APIs. The goal is not to memorize every method in `java.lang.String`, but to build a mental model for choosing the right family of operations.

```text
What do I need to do with the text?
        ↓
inspect
        ↓
search
        ↓
extract
        ↓
transform
        ↓
split / join
        ↓
convert / format
```

Most operations that produce different content return a **new String**. The original String does not change.
