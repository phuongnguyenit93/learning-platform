Cryptography turns selected trust assumptions into operations that can be checked with keys, data, algorithms, and parameters. Cipher can transform plaintext into ciphertext, Mac can authenticate data with a shared secret, and Signature can let a private-key holder produce a value that public-key holders verify.

Cryptography does **not** replace the rest of security architecture. It does not decide which user is authorized to call an API, protect a machine that is already compromised, rotate secrets by itself, or decide which certification authorities an organization should trust.

~~~text
security requirement
    ↓
cryptographic goal
    ↓
primitive + key model
    ↓
Java security API
    ↓
key/trust lifecycle + application policy
~~~

This module owns the middle of that chain. Authentication/authorization frameworks, IAM, infrastructure secret lifecycle, and operational PKI belong to their respective owners.
