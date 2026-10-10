# SecureRandom and Security Requirements

When randomness is part of a security contract, "looks random" is not enough. The important property is that an attacker should have difficulty predicting internal state and future output.

`SecureRandom` provides a cryptographically strong random source for appropriate use cases.
