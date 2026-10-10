A tag failure is an **authentication failure**, not a minor data-format error.

Java may report AEADBadTagException from doFinal when verification fails. Applications should not:

- release plaintext to business logic before authentication finishes;
- retry with a weaker algorithm or key;
- dump keys/plaintext into logs;
- expose unnecessarily detailed oracle-like errors to untrusted callers.

~~~java
try {
    byte[] plaintext = decryptor.doFinal(ciphertextAndTag);
    // Use plaintext only after successful final verification.
} catch (AEADBadTagException ex) {
    // Reject the record/message.
}
~~~

Failure semantics are part of the security design.
AEAD assumes both sides already possess suitable symmetric key material; the next question is how parties establish that shared secret in a structured way.
