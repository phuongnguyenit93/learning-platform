Security failures should not trigger a fallback that weakens the guarantee.

Reject or surface failures such as:

- AEAD tag verification failure;
- invalid MAC/signature;
- certificate-path or endpoint-identity failure;
- algorithms/keys blocked by policy;
- missing required provider services.

Do not retry with weaker padding, trust-all managers, disabled hostname verification, or legacy protocols simply to make the operation succeed.

Logs should contain useful non-secret context — algorithm, alias, certificate subject/fingerprint when appropriate, record identifier — but not passwords, private keys, raw secret keys, or plaintext secrets.

Fail closed can still be observable and well structured; it does not require chaotic crashes.
