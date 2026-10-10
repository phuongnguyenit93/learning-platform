Java Cipher commonly uses a transformation of the form:

~~~text
algorithm / mode / padding
~~~

For example, AES/GCM/NoPadding and AES/CBC/PKCS5Padding describe meaningfully different security behavior. Supplying only “AES” can leave mode/padding choices to provider defaults and make the intended contract unclear.

The **algorithm** names the core primitive. The **mode** controls how the block cipher is applied across data and which IV/nonce rules matter. **Padding** describes how input that does not match a block boundary is handled when the selected mode needs padding.

Treat the transformation as a security contract, not as an arbitrary configuration string. New designs that need tamper detection should prefer an appropriate authenticated mode rather than inventing integrity composition around an unauthenticated mode.
