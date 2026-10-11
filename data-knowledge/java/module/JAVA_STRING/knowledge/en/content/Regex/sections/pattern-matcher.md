Java separates the compiled pattern from matching state:

```java
Pattern pattern = Pattern.compile("(\\d+)-(\\w+)");
Matcher matcher = pattern.matcher(input);
```

`Pattern` represents the compiled regex; `Matcher` applies it to a particular input and maintains matching state.

Repeatedly compiling the same regex in a hot loop may be unnecessary; reuse `Pattern` when appropriate.

### Pattern and Matcher have different roles

```text
regex source
    ↓ compile
Pattern
    ↓ matcher(input)
Matcher
    ↓ execute/search + maintain match state
```

`Pattern` is immutable and shareable; `Matcher` carries mutable matching state and is normally created per input/use.

### matches, lookingAt, and find

They answer different questions:

```java
Pattern digits = Pattern.compile("\\d+");
String input = "123 abc 456";

digits.matcher(input).matches();   // does the entire input match?
digits.matcher(input).lookingAt(); // does a match begin at the start?

Matcher finder = digits.matcher(input);
while (finder.find()) {
    String match = finder.group();
}
```

```text
whole-input validation
→ matches

prefix pattern
→ lookingAt

search / repeated extraction
→ find
```
