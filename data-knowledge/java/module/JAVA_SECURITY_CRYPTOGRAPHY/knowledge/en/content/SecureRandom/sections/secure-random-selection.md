For many applications, new SecureRandom() is a reasonable default because the provider architecture chooses an implementation. If policy requires a specific algorithm or provider, SecureRandom.getInstance(...) gives more control.

SecureRandom.getInstanceStrong() selects an implementation configured as strong for the platform, but “strong” does not automatically mean “best for every request path.” Entropy acquisition and latency characteristics may differ.

Practical guidance:

- use SecureRandom, not Random, for secrets;
- reuse an instance where appropriate instead of creating one repeatedly to appear “more random”;
- leave normal seeding to the provider/runtime unless the protocol says otherwise;
- measure behavior if the workload consumes large amounts of random data.
