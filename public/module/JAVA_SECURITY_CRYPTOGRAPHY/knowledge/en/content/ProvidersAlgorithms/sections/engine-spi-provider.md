Keep three layers separate:

- an **engine class** is the API used by application code, such as Signature or Cipher;
- an **SPI** is the provider-side contract, such as SignatureSpi or CipherSpi;
- a **Provider** registers implementations of security services.

~~~text
application
    ↓
engine class
    ↓
JCA service lookup
    ↓
Provider
    ↓
SPI implementation
~~~

Ordinary application code rarely implements the SPI itself. Writing a provider is an extensibility task used for special implementations, hardware, or compliance environments.

The separation lets the engine-level application code remain stable while the concrete provider can change across JDKs, operating systems, or deployments.
