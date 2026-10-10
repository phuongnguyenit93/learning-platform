Both KeyAgreement and KEM can produce shared secret material, but the interaction models differ:

| | KeyAgreement | KEM |
| --- | --- | --- |
| main input | local private + peer public | receiver public/private + encapsulation |
| output | shared secret | secret key + encapsulation message |
| interaction | often both parties contribute key material | sender encapsulates to receiver |
| Java engine | KeyAgreement | KEM |

Choose according to protocol design and peer capabilities, not because one API is newer.

Neither mechanism automatically solves certificate trust, identity, replay, or lifecycle. Those concerns belong to the surrounding authenticated protocol.
Freshly established secret material commonly feeds a KDF or key schedule, while other secrets may be derived locally from inputs such as passwords; that leads into key derivation.
