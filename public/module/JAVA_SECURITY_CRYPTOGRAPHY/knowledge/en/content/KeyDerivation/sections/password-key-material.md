A password is **human-chosen input material**, not a ready-to-use cryptographic key.

PBEKeySpec stores the password as char[] so callers have an opportunity to clear the data when it is no longer needed:

~~~java
char[] password = ...;
PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, keyLength);
try {
    // derive key material
} finally {
    spec.clearPassword();
    Arrays.fill(password, '\0');
}
~~~

Clearing is good hygiene, not proof that every copy has disappeared from stacks, providers, or runtime internals. The goal is to reduce unnecessary lifetime rather than promise perfect memory erasure.
