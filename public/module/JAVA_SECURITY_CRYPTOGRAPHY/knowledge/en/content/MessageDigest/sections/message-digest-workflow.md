A MessageDigest workflow feeds bytes into the engine and finishes with digest():

~~~java
MessageDigest md = MessageDigest.getInstance("SHA-256");
md.update(headerBytes);
md.update(payloadBytes);
byte[] digest = md.digest();
~~~

For a simple buffer, digest(byte[]) is convenient; update calls are useful for streamed or chunked data.

After digest(), the engine is reset to its initial state according to the MessageDigest contract. Even so, a mutable instance should not be casually shared across concurrent requests.

When hashing text, always choose the byte encoding explicitly, such as StandardCharsets.UTF_8. Two logically similar strings encoded differently produce different byte sequences and therefore different digests.
