MessageDigest represents a cryptographic hash function. It accepts arbitrary input and produces a digest whose length is determined by the algorithm.

~~~text
bytes
  ↓ hash
fixed-size digest
~~~

A digest has **no secret key**. Any party with the same input and algorithm can compute it. That makes hashes useful for fingerprints and trusted comparisons, but it also means a digest by itself does not prove who produced the data.

A suitable hash algorithm should provide the required preimage and collision-resistance properties for the use case. Do not treat the word “hash” as a permanent guarantee; security policy evolves and older algorithms may be restricted.
