A useful distinction is “who can create a valid value?”:

| Mechanism | Key used to create | Who can create |
| --- | --- | --- |
| digest | none | anyone with the data |
| MAC | shared secret | every secret holder |
| signature | private key | private-key holder |

A MAC provides integrity plus shared-secret authenticity, but does not hide the message.

For a new protocol that needs both confidentiality and integrity, authenticated encryption is often clearer and less error-prone than designing a custom encrypt-then-MAC composition, unless an existing specification already defines that composition.
A MAC provides authenticity inside a shared-secret trust domain; when verifiers must not gain signing authority, the next model separates that authority with digital signatures.
