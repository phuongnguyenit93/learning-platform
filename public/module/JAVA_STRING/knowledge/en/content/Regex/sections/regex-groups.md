Parentheses create capturing groups by default:

```regex
(\d+)-(\w+)
```

After a match, `group(1)` and `group(2)` expose the captured text.

Use non-capturing groups `(?:...)` when grouping is needed but capture is not. Named groups can make complex patterns easier to understand.

```java
Pattern p = Pattern.compile(
        "(?<user>[a-z]+)@(?<domain>[a-z.]+)"
);
Matcher m = p.matcher("ada@example.com");

if (m.matches()) {
    m.group("user");   // ada
    m.group("domain"); // example.com
}
```

### group(0) and group(n)

After a successful match:

```text
group(0)
→ the complete match

group(1..n)
→ the corresponding capturing group
```

Calling `group(...)` without a successful match state throws `IllegalStateException`.

### Replacement has syntax too

In `replaceAll` / `Matcher.replaceAll` replacement text, `$` and `\` have special meaning. When a runtime replacement must be literal, use `Matcher.quoteReplacement(...)` where appropriate.
