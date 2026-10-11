The shared secret defines the trust boundary of a MAC. If services A and B share an HMAC key, A can verify messages from B, but A can also generate a message/tag pair that looks valid to any other holder of the same key.

That is appropriate when the protocol accepts shared authority inside one trust domain. It is not appropriate when verifiers must not have signing authority; an asymmetric signature fits that requirement better.

The MAC key must have suitable entropy and size for the chosen algorithm. A human password should not be used directly as an HMAC key; derive key material first when the source is a password.
