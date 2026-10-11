Common mistakes confuse **random-looking** with **security-random**:

- using Random or a predictable seed for reset tokens or keys;
- reusing a nonce in a mode that requires uniqueness;
- using one fixed salt for every password record;
- deriving keys by arbitrarily hashing predictable application data;
- logging raw secrets for debugging.

Good randomness cannot repair a bad primitive choice. A random key does not turn an unauthenticated mode into AEAD, and a random nonce does not replace certificate validation.

During review, ask two separate questions: “must this value be unpredictable?” and “must it be unique?” Protocols may require one, the other, or both.
Secure randomness commonly feeds key, nonce, and seed generation, so the next step is to distinguish key types and key-material lifecycles.
