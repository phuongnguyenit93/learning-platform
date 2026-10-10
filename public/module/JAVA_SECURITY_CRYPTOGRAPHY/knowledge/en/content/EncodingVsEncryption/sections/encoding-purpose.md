**Encoding** changes representation so data fits a format or transport. It does not create a confidentiality boundary. Base64 is the common example: binary bytes become text, but anyone can decode them without a secret.

~~~java
String encoded = Base64.getEncoder()
        .encodeToString("hello".getBytes(StandardCharsets.UTF_8));

byte[] original = Base64.getDecoder().decode(encoded);
~~~

A token that is only Base64-encoded remains a secret in a trivially reversible representation. “Not immediately readable” is not encryption.

Encoding still appears around cryptography because ciphertext, digests, signatures, and certificates often need text-safe representation. Treat it as a **representation layer**, not as a security primitive.
