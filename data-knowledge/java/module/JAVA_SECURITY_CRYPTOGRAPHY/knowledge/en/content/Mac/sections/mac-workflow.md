Java exposes MAC algorithms through javax.crypto.Mac:

~~~java
Mac mac = Mac.getInstance("HmacSHA256");
mac.init(secretKey);
mac.update(headerBytes);
byte[] tag = mac.doFinal(payloadBytes);
~~~

The verifier computes the MAC over the **same canonical bytes** and compares tags. For byte-array tags, `MessageDigest.isEqual(expectedTag, receivedTag)` is preferable to a hand-written loop that exits on the first mismatch:

~~~java
byte[] expectedTag = verifier.doFinal(payloadBytes);
boolean valid = MessageDigest.isEqual(expectedTag, receivedTag);
~~~

`MessageDigest.isEqual(...)` examines all bytes of the first digest and its calculation time does not depend on the digest contents. If one side serializes JSON differently, normalizes newlines differently, or uses another charset, the MAC still changes even if the application considers the logical content equivalent.

A protocol therefore needs a precise definition of the authenticated byte sequence.

When debugging a mismatch, log non-secret metadata such as algorithm, message identifier, version, and lengths — not the shared secret itself.
