A common anti-pattern is asking “AES or RSA?” before deciding what needs protection.

A better review flow is:

~~~text
asset + attacker capability
        ↓
security goal
        ↓
trust/key model
        ↓
standard protocol/primitive
        ↓
Java API + provider
        ↓
parameters + lifecycle + failure policy
~~~

If the real need is only a fingerprint for deduplication, encryption is the wrong abstraction. If a confidential record also needs tamper detection, authenticated encryption is clearer than combining unrelated operations by intuition.

The API choice should be the result of the design, not the beginning of it.
