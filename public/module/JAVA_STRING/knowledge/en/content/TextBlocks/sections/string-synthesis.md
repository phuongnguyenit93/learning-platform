The module's final mental model is:

```text
String is immutable
→ safe sharing/pooling becomes possible
→ equality is content-based, not pool identity
→ builders provide mutable construction
→ char/code point/grapheme are different representation levels
→ text/bytes require an explicit Charset
→ regex describes text patterns
→ text blocks improve source syntax only
```

Before choosing an API in real code, identify the layer of the problem:

```text
represent a text value in Java
→ String

construct text incrementally
→ StringBuilder / StringBuffer when its synchronization behavior is genuinely required

process Unicode at the correct representation level
→ code unit / code point / grapheme as required

cross a file, network, or byte-oriented protocol boundary
→ explicit Charset + encode/decode

describe a matching/search pattern
→ regex when simpler String operations are not enough

write a readable multiline source literal
→ text block
```

Locale-sensitive ordering, collation, and segmentation belong primarily to the Localization module, while deeper file/stream/channel concerns belong to I/O. String provides the text value model that those neighboring modules build on.
