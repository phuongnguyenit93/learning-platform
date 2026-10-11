Visually equivalent text can use different code-point sequences. A precomposed accented character and a base character plus combining mark are a common example.

`java.text.Normalizer` supports normalization forms such as NFC and NFD.

The main forms are:

```text
NFD
→ canonical decomposition

NFC
→ canonical decomposition + composition

NFKD
→ compatibility decomposition

NFKC
→ compatibility decomposition + composition
```

NFKC/NFKD may remove compatibility distinctions beyond canonical normalization, so do not choose them merely because they sound “stronger”.

Normalization is a policy decision for comparison/search/storage, not something every String operation should perform automatically.

Do not normalize every input blindly. Identifiers, security-sensitive tokens, signature inputs, or external protocols may require the exact sequence.
