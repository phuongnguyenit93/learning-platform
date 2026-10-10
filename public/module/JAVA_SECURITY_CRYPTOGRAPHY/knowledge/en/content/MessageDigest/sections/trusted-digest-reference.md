A digest detects meaningful modification only when the verifier has a **trusted reference value**.

For example, a repository may publish a SHA-256 digest through an authenticated channel. A client downloads the file from a mirror and compares its locally computed digest with that trusted value.

If an attacker can replace both the file and the stored reference:

~~~text
modified file
    +
digest(modified file)
~~~

the comparison still succeeds. The hash has not created authenticity.

For security-sensitive byte comparison, MessageDigest.isEqual(...) provides a digest-oriented comparison API instead of hand-writing a loop that exits on the first unequal byte.
