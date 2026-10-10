Engine classes use **standard algorithm names** to describe the requested service. MessageDigest may use SHA-256, Mac may use HmacSHA256, and KeyStore may use PKCS12.

Cipher commonly uses a **transformation**:

~~~text
algorithm / mode / padding
~~~

AES/GCM/NoPadding says more than “AES”: it also fixes the mode and padding semantics, which in turn determine requirements such as nonce handling and authentication tags.

Avoid ambiguous transformation strings when security depends on mode or padding behavior. Explicit transformations make code review and interoperability clearer.

Valid names and mandatory support should be checked against the Java Security Standard Algorithm Names specification and the provider in the actual runtime, not inferred from a random example.
