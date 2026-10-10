Hybrid encryption combines public-key and symmetric mechanisms:

~~~text
generate random content-encryption key
        ↓
protect payload with symmetric AEAD
        ↓
protect/establish the content key with a public-key mechanism
        ↓
package protected key + nonce + ciphertext + metadata
~~~

The receiver performs the private-key operation to recover or derive the content key, then uses the symmetric key for the payload.

This avoids expensive public-key operations over large data and lets AEAD provide efficient authenticated payload protection.

Prefer an established protocol or container format over inventing a custom hybrid envelope. Key wrapping, context binding, algorithm identifiers, and versioning all affect security and interoperability.
Hybrid encryption addresses payload efficiency and key transport, but confidentiality alone still does not guarantee tamper detection; authenticated encryption is the next step.
