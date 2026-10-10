Two password concepts are often confused:

- a **store password** used while loading/storing some KeyStore formats;
- **entry protection** that may protect an individual private or secret key.

Do not assume these passwords always exist, always match, or behave identically across providers.

If the store is file-backed, filesystem permissions, backup policy, and deployment-secret handling still matter. Hard-coding the password in source merely moves the secret to a weaker location.

With providers such as PKCS#11, KeyStore can also act as a Java boundary to hardware-backed material where a private key may never be exported into ordinary application memory.
