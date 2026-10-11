Before choosing a primitive, ask **what the attacker can actually do**. If an attacker can only read a database copy, confidentiality may be the primary goal. If the attacker can also modify traffic, integrity and authenticity become relevant. If the endpoint itself is compromised and the attacker can read keys from the process, encrypting data inside that same process cannot recreate the lost trust boundary.

A minimal threat model should identify:

1. the assets that need protection;
2. where the data exists — memory, file, database, or network;
3. who is allowed to read or produce it;
4. whether the attacker can read, modify, replay, or impersonate;
5. which keys or certificates are treated as trust anchors.

The module boundary matters as well. Socket and HTTP mechanics belong to Networking. CA operations, HSM administration, IAM, and secret rotation are infrastructure concerns. Here we learn enough to use Java key, certificate, trust, and cryptographic APIs correctly.
