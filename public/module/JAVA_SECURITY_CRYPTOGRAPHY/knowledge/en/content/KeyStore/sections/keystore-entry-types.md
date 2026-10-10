Three entry types are especially important:

- **PrivateKeyEntry** — a private key with its corresponding certificate chain;
- **SecretKeyEntry** — a symmetric secret key;
- **TrustedCertificateEntry** — a trusted certificate without an associated private key.

An alias existing in the store does not imply that it represents a private key.

~~~java
KeyStore.Entry entry = keyStore.getEntry(
        alias,
        new KeyStore.PasswordProtection(entryPassword)
);
~~~

Code should validate the expected entry type and fail clearly when deployment provides the wrong alias or entry shape. Avoid turning configuration mistakes into opaque ClassCastException failures.
