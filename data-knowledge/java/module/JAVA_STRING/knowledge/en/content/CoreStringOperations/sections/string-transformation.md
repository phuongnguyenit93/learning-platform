APIs such as `replace`, `trim`, `strip`, `toUpperCase`, and `toLowerCase` describe a **new value**:

```java
String raw = "  java-core  ";

String cleaned = raw.strip();
String renamed = cleaned.replace("core", "string");

System.out.println(raw);     // "  java-core  "
System.out.println(renamed); // "java-string"
```

`trim()` and `strip()` are not simply two names for the same rule. `strip()` removes leading/trailing characters according to `Character.isWhitespace(...)`, while `trim()` follows Java's historical rule of removing leading/trailing characters whose code is at most `U+0020`. `strip()` is therefore usually the better fit for Java's Unicode-aware whitespace API, but `Character.isWhitespace` should not be treated as identical to every Unicode whitespace property.

Related operations include:

```java
text.stripLeading();
text.stripTrailing();
```

### replace is not replaceAll

```java
"a.b".replace(".", "-");    // "a-b"
"a.b".replaceAll(".", "-"); // "---"
```

`replace` takes literal characters/sequences. `replaceAll` takes a regex, where `.` uses regex dot semantics: by default it matches a character except a line terminator, and `DOTALL` can change that rule. The `"a.b"` example has no line terminator, so all three characters are replaced.

### Some modern text operations

You do not need to memorize every `String` method, but several newer operations express intent clearly:

```java
String lines = "alpha\nbeta\n";

lines.lines().forEach(System.out::println);

"ab".repeat(3); // "ababab"
```

`lines()` produces a stream for iterating lines according to that API's line-terminator contract, avoiding manual scanning/slicing when the task is simply line-by-line processing. `repeat(n)` repeats text `n` times and is useful for simple formatting or test data.

APIs such as `indent` and `stripIndent` connect more directly to multiline text and continue in the Text Blocks chapter.

Case conversion also depends on intent:

```text
human-language text
→ may require Locale-aware rules

technical token / protocol identifier
→ needs rules defined by that contract
```

Full locale and collation behavior belongs to the `localization` module. This chapter establishes the boundary so lower/upper-case conversion is not treated as a universal normalization strategy.
