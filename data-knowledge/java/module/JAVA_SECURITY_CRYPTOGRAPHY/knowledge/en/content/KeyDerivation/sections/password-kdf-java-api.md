Password-based derivation commonly uses **SecretKeyFactory plus PBEKeySpec**:

~~~java
SecretKeyFactory factory =
        SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

PBEKeySpec spec =
        new PBEKeySpec(password, salt, iterations, 256);

byte[] derived;
try {
    derived = factory.generateSecret(spec).getEncoded();
} finally {
    spec.clearPassword();
}
~~~

The algorithm above is a common provider-supported example, not a permanent recommendation for every security policy. Select the KDF and parameters according to current requirements, threat model, and interoperability needs.

If the bytes become an AES/HMAC key, document the expected length, encoding, and purpose so all participants derive the same material.
