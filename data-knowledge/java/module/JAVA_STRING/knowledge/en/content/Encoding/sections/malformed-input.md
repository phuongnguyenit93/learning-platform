Encoding/decoding can fail semantically:

- **malformed input**: the input sequence is structurally invalid for the encode/decode operation, such as malformed UTF-8 bytes during decoding or an unpaired surrogate during encoding;
- **unmappable character**: a character cannot be represented in the target charset.

`CharsetDecoder` and `CharsetEncoder` can report, replace, or ignore such cases. Choose that policy intentionally; silent replacement can hide data corruption.

### Malformed is different from unmappable

```text
malformed input
→ input structure is invalid for the decoder/encoder
→ for example malformed UTF-8 bytes or an unpaired UTF-16 surrogate

unmappable character
→ valid character cannot be represented in the target charset
```

A UTF-8 decoder can encounter malformed bytes, while an encoder can encounter malformed UTF-16 input such as an unpaired surrogate. By contrast, a valid Unicode `é` encoded to US-ASCII is **unmappable** because ASCII cannot represent that character.

### Convenience APIs vs strict validation

`getBytes(Charset)` and `new String(bytes, charset)` are convenient for common cases, but these convenience overloads are specified to **replace** malformed/unmappable input using the charset's replacement rather than report it to the caller. If invalid data must be detected, ignored, or handled with a custom policy, use `CharsetEncoder` / `CharsetDecoder` with an explicit `CodingErrorAction.REPORT`, `REPLACE`, or `IGNORE` policy.

```text
data integrity matters
→ REPORT often supports fail-fast behavior

best-effort display
→ REPLACE may be acceptable

IGNORE
→ can silently lose data, so it needs a deliberate reason
```

The next chapter moves from representation boundaries to **regular expressions**, where patterns describe how text should be matched, searched, or transformed.
