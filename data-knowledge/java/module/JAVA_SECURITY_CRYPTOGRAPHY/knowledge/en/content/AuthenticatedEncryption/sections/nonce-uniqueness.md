For GCM, **nonce/IV uniqueness under the same key is critical**. Reuse can reveal relationships between plaintexts and undermine authentication security.

A nonce usually does not need to remain secret. The hard requirement is lifecycle:

- generate it with a strategy that prevents reuse under the same key;
- store or transmit it with the ciphertext;
- coordinate the strategy with key rotation;
- avoid rollback or duplicated state if counters are used.

Random nonces rely on collision probability at the system's scale; counter-based nonces rely on durable state discipline. Choose according to architecture rather than copying one universal snippet.

Do not try to “fix” reuse by hashing timestamps or previous nonces ad hoc.
