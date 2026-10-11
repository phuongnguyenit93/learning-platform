Make the charset explicit at boundaries:

```java
byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
String restored = new String(bytes, StandardCharsets.UTF_8);
```

An explicit standard charset makes the contract independent of the machine's default configuration.

If the two sides disagree:

```text
text
→ encode as UTF-8
→ bytes
→ decode as ISO-8859-1
→ mojibake / wrong text
```

The transport may have delivered every byte correctly; the bug is the interpretation contract.

A round trip preserves text only when the charset and error policy can represent the input.
