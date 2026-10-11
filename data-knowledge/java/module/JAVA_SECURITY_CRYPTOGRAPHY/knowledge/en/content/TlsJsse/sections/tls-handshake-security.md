The TLS handshake establishes a security context before normal application data flows. At a conceptual level it needs to:

- negotiate compatible protocol and cryptographic capabilities;
- authenticate peers as required by the mode;
- perform key establishment;
- derive traffic keys;
- confirm both parties agree on the protected handshake state.

The record layer then uses symmetric authenticated protection for traffic.

Applications should not extract and repurpose “TLS keys” for unrelated application cryptography. TLS owns its key schedule and context binding.

Handshake failures often represent meaningful security/configuration problems: untrusted certificates, wrong identities, disabled algorithms, protocol mismatches, or unsuitable key material.
