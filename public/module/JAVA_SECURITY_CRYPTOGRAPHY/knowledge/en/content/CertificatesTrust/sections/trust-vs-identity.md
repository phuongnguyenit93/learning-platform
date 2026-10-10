Two checks answer different questions:

1. **trust validation** — does the certificate/path satisfy the configured CA/trust-anchor policy?
2. **identity verification** — does the certificate represent the endpoint or hostname that the application intended to reach?

A certificate can be perfectly trusted for attacker.example and still be wrong for api.example.

TLS clients generally need both checks. JSSE/HTTP stacks support endpoint identification based on hostname and certificate identity data.

A TrustManager that accepts everything or a hostname verifier that always returns true removes part of the security contract. Trust says “this path is acceptable”; identity says “this key belongs to the peer I meant to contact.”
Once key material, certification paths, trust, and endpoint identity are understood, those pieces can be combined in the secure-channel model provided by JSSE/TLS.
