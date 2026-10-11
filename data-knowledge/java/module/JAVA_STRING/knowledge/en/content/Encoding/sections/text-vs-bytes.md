A String such as `"Xin chào"` does not have one universal byte sequence. Different charsets can encode the same text differently.

```text
String / text
        ↓ encode with Charset
byte[]
        ↓ decode with the same Charset
String / text
```

If encoding and decoding disagree about the charset, the bytes may arrive intact while the reconstructed text is wrong.

### WHY — a String does not “already have an encoding”

`String` is a Java text value. Encoding appears when text crosses a byte-oriented boundary:

```text
Java String
→ file
→ socket / HTTP body
→ database protocol
→ message-broker payload
```

The same text can have different byte representations:

```text
"é"

UTF-8
→ C3 A9

ISO-8859-1
→ E9
```

So “what encoding is this String?” is usually the wrong-layer question. Ask instead: **which Charset maps String ↔ bytes at this boundary?**
