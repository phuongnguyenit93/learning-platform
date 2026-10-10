Algorithm and provider selection must balance current security policy with portability.

Prefer to:

- use standard algorithm names where possible;
- avoid provider pinning without a requirement;
- validate required algorithms during bootstrap;
- version persistent/protocol formats so algorithm or parameter changes can be represented later;
- allow JDK constraints to reject weak choices rather than silently downgrading.

Ciphertext that outlives the process also needs enough metadata to recover the intended transformation, nonce, version, and KDF parameters.

“Works on my JDK” is not a portability guarantee. Provider inventories and policy can differ across operating systems, JDK vendors, HSM deployments, and future JDK versions.
