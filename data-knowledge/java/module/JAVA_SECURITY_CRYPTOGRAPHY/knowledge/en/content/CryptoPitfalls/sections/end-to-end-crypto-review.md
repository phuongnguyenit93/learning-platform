An end-to-end review should follow the entire lifecycle instead of inspecting only one Cipher.getInstance call:

1. **asset/threat** — reading, modification, impersonation, replay?
2. **primitive/protocol** — is there an established mechanism?
3. **key origin** — generate, derive, KeyAgreement, KEM, or KeyStore?
4. **parameters** — nonce, salt, work factor, transformation, protocol version?
5. **trust** — how is a public key/certificate authenticated?
6. **storage/transport** — which metadata travels with the protected value?
7. **failure** — what happens on tag/signature/trust failure?
8. **rotation/migration** — how will keys and algorithms change later?

An unanswered item is often a real design gap even when the code compiles and happy-path tests pass.

The module's goal is not memorizing every class; it is learning the reasoning chain from a security goal to the Java mechanism and its production boundary.
