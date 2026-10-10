A cryptographic hash accepts arbitrary input and produces a fixed-size digest. The same input produces the same digest, while suitable algorithms are designed so that reversing the digest or finding useful collisions is computationally difficult.

Hashes are useful for fingerprints, trusted file checks, and as building blocks inside other constructions. They have **no secret key**, which means an attacker who can change both the data and the stored digest can simply compute a new digest.

That is why hashing alone is not authentication. It is also why storing passwords as a single MessageDigest value is insufficient: human passwords have low entropy and attackers can test candidates quickly. Password-based derivation with salt and work factor appears later in the module.
