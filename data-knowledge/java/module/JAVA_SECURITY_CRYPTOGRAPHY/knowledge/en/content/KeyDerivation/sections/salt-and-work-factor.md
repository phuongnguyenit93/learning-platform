A **salt** is not secret. It should be unique/random enough that equal passwords in different records do not produce the same derived result and that one precomputed table cannot be reused globally.

The **work factor** makes each password guess deliberately more expensive. With PBKDF2, iteration count is part of the parameter set. A suitable value is not timeless; hardware and policy change, so production systems should calibrate and version their parameters.

A record generally needs enough information to reproduce derivation:

~~~text
KDF identifier/version
salt
work factor / parameters
derived verifier or protected payload
~~~

Avoid one fixed global salt. Also avoid work factors that turn legitimate authentication into self-inflicted denial of service.
