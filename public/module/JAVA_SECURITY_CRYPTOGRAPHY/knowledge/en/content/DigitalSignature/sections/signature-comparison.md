A digital signature is not “encryption with the private key.” The operations have different goals and scheme semantics even when they use keys from the same mathematical family.

- **signature**: private key signs, public key verifies; goal is authenticity/integrity;
- **asymmetric encryption**: public key commonly protects data for the private-key holder; goal is confidentiality;
- **MAC**: one shared secret creates and verifies tags.

Thinking in terms of “reverse encryption” hides important details such as signature encoding, padding, and security proofs.

If a protocol needs confidentiality and signer identity, use a standard composition instead of substituting a reversed Cipher operation for a signature.
A signature provides authenticity but does not hide content, so the module now turns to confidentiality, beginning with symmetric encryption.
