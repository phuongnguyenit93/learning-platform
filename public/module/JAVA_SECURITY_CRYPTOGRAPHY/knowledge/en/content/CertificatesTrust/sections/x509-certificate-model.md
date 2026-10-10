An X.509 certificate binds a **public key** to subject/identity information and metadata such as issuer, validity, and extensions. The certificate is signed by an issuer so a verifier can validate that binding within a trust model.

The certificate does not contain the private key. Private key material typically lives separately, for example in a PrivateKeyEntry, while certificates can be distributed publicly.

Java X509Certificate exposes subject/issuer information, public key, validity, SAN values, key usage, and extensions.

Parsing a certificate is not the same as trusting it. Trust requires certification-path validation against configured trust anchors and policy.
