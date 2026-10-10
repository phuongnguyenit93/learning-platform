Two canonically equivalent Strings can still satisfy:

```java
System.out.println(a.equals(b)); // false
```

when their code-point sequences differ.

Normalizing both to the same form may make equality align with the use case.

`String.equals` compares String sequences; it does not automatically apply Unicode normalization or linguistic equivalence.

Concrete example:

```java
String composed = "é";
String decomposed = "e\u0301";

composed.equals(decomposed); // false

String a = Normalizer.normalize(composed, Normalizer.Form.NFC);
String b = Normalizer.normalize(decomposed, Normalizer.Form.NFC);

a.equals(b); // true
```

Canonical equivalence is a Unicode concept; linguistic equality or search may require a higher locale/collation layer.

The next chapter uses this Unicode model at an external boundary: how does Java text become bytes and return from bytes through an explicit Charset?
