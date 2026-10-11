A Key object is a point where Java code touches **high-value secret material**, so lifecycle matters as much as the algorithm.

A design review should ask:

- was the key generated, derived, established, or loaded from a store/HSM?
- can the raw key be exported?
- how long does it remain in memory?
- can logging, serialization, crash dumps, or exceptions expose it?
- who owns rotation and revocation?

Some key implementations participate in Destroyable-style lifecycle controls, but destroying one object should not be interpreted as proof that every copy has disappeared from heap, provider, or native memory.

This module owns the Java API boundary. Key rotation, backup, escrow, and hardware protection are infrastructure concerns.
With the key model established, the integrity/authenticity family can start from its simplest case: an unkeyed digest.
