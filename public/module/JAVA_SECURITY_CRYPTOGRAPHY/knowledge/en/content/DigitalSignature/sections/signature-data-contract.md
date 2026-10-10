A signature protects the **exact bytes that were signed**, not the broader business meaning that a developer intended.

If a producer signs JSON bytes but a consumer parses and reserializes before verification, differences in whitespace, field ordering, or Unicode representation may break validation. Conversely, if only selected fields are signed while business logic trusts the whole object, unsigned fields may remain mutable.

A robust protocol defines:

- the exact payload or canonical representation;
- context/version binding;
- which keys or certificate identities may sign;
- replay handling when replay is part of the threat model.

The Signature API does not design that data contract for the application.
