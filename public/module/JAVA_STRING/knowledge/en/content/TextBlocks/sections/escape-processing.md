Text blocks still process Java escape sequences and have defined line-terminator/closing-delimiter behavior.

They are not raw strings. If backslash or newline behavior must be exact, reason about the final Java String value.

### `\s` preserves an intentional space

```java
String value = """
        red  \s
        green\s
        """;
```

`\s` becomes a space after incidental-whitespace processing, which makes intentional trailing space visible in source.

### Line continuation

A backslash at the end of a physical line can suppress that line terminator:

```java
String sentence = """
        hello \
        world
        """;
```

This is source-level escape behavior, not String mutation.

### Processing order matters

A useful mental model is:

```text
normalize line terminators
→ strip incidental whitespace
→ process escape sequences
→ String value
```

That order explains why `\s` can preserve a space even though ordinary source whitespace may be stripped.

### translateEscapes

`translateEscapes()` is useful when a **runtime String** contains escape notation and the application intentionally wants to interpret it:

```java
String escaped = "line1\\nline2";
String translated = escaped.translateEscapes();

System.out.println(translated);
```

```text
runtime text "\\n"
→ translateEscapes()
→ newline character
```

This differs from Java source-literal escape processing: source escapes are handled by the compiler, while `translateEscapes()` is a runtime String operation.

In particular, `translateEscapes()` does **not** interpret Unicode-escape notation such as `\\uXXXX`; runtime text like `"\\u0041"` is not converted to `"A"` by this API and is treated as an invalid escape sequence.

Do not run `translateEscapes()` on arbitrary user input simply because it contains backslashes; interpreting escape notation must be part of the input contract.
