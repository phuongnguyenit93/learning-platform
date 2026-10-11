A certificate can still be within its validity period after its private key has been compromised or the issuer has revoked it. Revocation checking lets the verifier incorporate status information such as CRLs or OCSP according to PKIX/provider configuration.

CertPathValidator can expose a PKIXRevocationChecker for more detailed control.

Revocation has operational trade-offs: network availability, caching, freshness, and soft-fail versus hard-fail behavior all affect reliability and security. There is no universal setting for every system.

The important point is to choose failure policy deliberately. Disabling revocation merely to remove certificate errors can turn an incident signal into a trust bypass.
