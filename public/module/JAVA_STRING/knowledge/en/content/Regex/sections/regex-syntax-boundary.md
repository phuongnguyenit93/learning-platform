Before groups and quantifiers, separate three concerns: when regex complexity is justified, how regex syntax is represented inside Java String literals, and how compilation flags change matching behavior.

### Java escaping and regex escaping are two layers

To make the runtime regex `\d+`:

```java
Pattern.compile("\\d+");
```

```text
Java source "\\d+"
        ↓ Java string parsing
runtime String "\d+"
        ↓ regex parsing
digit pattern
```

This is why Java regexes often appear to contain “double backslashes”.

When runtime text must be matched literally rather than interpreted as regex syntax, `Pattern.quote(text)` is often the correct boundary.

### Basic building blocks

```text
[abc]     character class
[^abc]    negated class
^ / $     anchors
a|b       alternation
(...)     group
\d \w   predefined classes
```

Do not reach for regex when a direct literal String operation is clearer; that decision boundary was established at the start of the chapter.

### Pattern flags change matching semantics

The same regex source can have different semantics when compiled with flags:

```java
Pattern multiline = Pattern.compile(
        "^error:",
        Pattern.MULTILINE
);

Pattern dotAll = Pattern.compile(
        "BEGIN.*END",
        Pattern.DOTALL
);
```

Important flags include:

```text
CASE_INSENSITIVE
→ case-insensitive matching

MULTILINE
→ ^ and $ can operate at line boundaries

DOTALL
→ . also matches line terminators

UNICODE_CASE
→ Unicode-aware case folding when combined with case-insensitive behavior

UNICODE_CHARACTER_CLASS
→ predefined/POSIX character classes use broader Unicode semantics
```

Do not enable flags “just in case”. A flag is part of the regex contract and can affect both correctness and performance.

Unicode regex semantics should also not be confused with locale-sensitive language rules: regex flags and `Locale/Collator` solve different abstraction layers.
