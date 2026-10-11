Public-key operations are typically more expensive than symmetric encryption and often have strict input-size limits imposed by the scheme and key size. RSA encryption, for example, should not be treated as a stream cipher for arbitrarily chunking large files.

Padding and encoding schemes are part of the security definition. “RSA” alone is not a complete secure protocol.

Public-key cryptography is therefore commonly used to protect **small secret material** or establish keys, while large payloads are protected by symmetric authenticated encryption.

That split leads naturally to hybrid encryption: each primitive is used for the job it handles well.
